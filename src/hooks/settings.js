'use strict';

var _ = require('lodash');
var debug = require('debug')('formio:settings');
var o365Util = require('../actions/office365/util');
var nodeUrl = require('url');

module.exports = function(app, formioServer) {
  // Include the request cache.
  var cache = require('../cache/cache')(formioServer.formio);

  // Attach the project plans to the formioServer
  formioServer.plans = require('../plans/index')(formioServer, cache);

  return {
    settings: function (settings, req, cb) {
      if (!req.projectId) {
        return cb('No project ID provided.');
      }

      // Load the project settings.
      cache.loadProject(req, req.projectId, function (err, project) {
        if (err) {
          return cb(err);
        }
        if (!project) {
          return cb('Could not find project');
        }

        // Call the callback with the project settings.
        cb(null, project.settings);
      });
    },
    on: {
      init: function (type, formio) {
        switch (type) {
          case 'alias':

            // Dyanmically set the baseUrl.
            formio.middleware.alias.baseUrl = function (req) {
              return '/project/' + req.projectId;
            };

            // Add the alias handler.
            app.use(formio.middleware.alias);
            return true;
          case 'params':
            app.use(formio.middleware.params);
            return true;
          case 'token':
            app.use(formio.middleware.tokenHandler);
            return true;
          case 'logout':
            app.get('/logout', formio.auth.logout);
            return true;
          case 'current':
            app.get('/current', formio.auth.currentUser);
            return true;
          case 'perms':
            app.use(formio.middleware.permissionHandler);
            return true;
        }

        return false;
      },
      formRequest: function (req, res) {
        // Make sure to always include the projectId in POST and PUT calls.
        if (req.method === 'PUT' || req.method === 'POST') {
          req.body.project = req.projectId || req.params.projectId;
        }
      },
      email: function (transport, settings, projectSettings, req, res) {
        if ((transport === 'outlook') && projectSettings.office365.email) {
          o365Util.request(formioServer, req, res, 'sendmail', 'Office365Mail', {
            Message: {
              Subject: nunjucks.renderString(settings.subject, req.body),
              Body: o365Util.getBody(settings.message, req.body),
              ToRecipients: o365Util.getRecipients(settings.emails, req.body),
              From: o365Util.getRecipient(projectSettings.office365.email)
            }
          });
        }
      }
    },
    alter: {
      resources: function (resources) {
        return _.assign(resources, require('../resources/resources')(app, formioServer.formio));
      },
      models: function (models) {
        // Add the project to the form schema.
        models.form.schema.add({
          project: {
            type: formioServer.formio.mongoose.Schema.Types.ObjectId,
            ref: 'project',
            index: true,
            required: true
          }
        });

        // Add additional models.
        return _.assign(models, require('../models/models')(formioServer));
      },
      actions: function (actions) {
        actions.office365contact = require('../actions/office365/Office365Contact')(formioServer);
        actions.office365calendar = require('../actions/office365/Office365Calendar')(formioServer);
        actions.hubspotContact = require('../actions/hubspot/hubspotContact')(formioServer);
        return actions;
      },
      emailTransports: function (transports, settings) {
        settings = settings || {};
        var office365 = settings.office365 || {};
        if (office365.tenant && office365.clientId && office365.email && office365.cert && office365.thumbprint) {
          transports.push(
            {
              transport: 'outlook',
              title: 'Outlook'
            }
          );
        }
        return transports;
      },
      url: function (url, req) {
        return '/project/' + req.projectId + url;
      },
      fieldUrl: function (url, form, field) {
        return '/project/' + form.project + url;
      },
      host: function(host, req) {
        // Load the project settings.
        var project = cache.currentProject(req);
        return project.name + '.' + host;
      },
      token: function (token, user, form) {
        token.form.project = form.project;
        return token;
      },
      isAdmin: function (isAdmin, req) {
        // If no user is found, then return false.
        if (!req.token || !req.token.user) {
          return false;
        }

        // Ensure we have a projectOwner
        if (!req.projectOwner) {
          return false;
        }

        // Project owners are default admins.
        return req.token.user._id === req.projectOwner;
      },
      getAccess: function (handlers, req, res, access) {
        var _debug = require('debug')('formio:settings:getAccess');

        // Get the permissions for an Project with the given ObjectId.
        handlers.unshift(
          formioServer.plans.checkRequest(req, res),
          function getProjectAccess(callback) {
            // Build the access object for this project.
            access.project = {};

            // Skip project access if no projectId was given.
            if (!req.projectId) {
              return callback(null, access);
            }

            // Load the project.
            cache.loadProject(req, req.projectId, function(err, project) {
              if (err) {
                _debug(err);
                return callback(err);
              }
              if (!project) {
                _debug('No project found with projectId: ' + req.projectId);
                return callback('No project found with projectId: ' + req.projectId);
              }

              // Store the Project Owners UserId, because they will have all permissions.
              if (project.owner) {
                access.project.owner = project.owner.toString();

                // Add the UserId of the Project Owner for the ownerFilter middleware.
                req.projectOwner = access.project.owner;
              }

              // Add the other defined access types.
              if (project.access) {
                project.access.forEach(function (permission) {
                  access.project[permission.type] = access.project[permission.type] || [];

                  // Convert the roles from BSON to comparable strings.
                  permission.roles.forEach(function (id) {
                    access.project[permission.type].push(id.toString());
                  });
                });
              }

              // Pass the access of this project to the next function.
              return callback(null);
            });
          }
        );
        return handlers;
      },
      accessEntity: function (entity, req) {
        if (entity.type == 'form') {

          // If this is a create form or index form, use project as the access entity.
          var createForm = ((req.method === 'POST') && (Boolean(req.formId) === false));
          var indexForm = ((req.method === 'GET') && (Boolean(req.formId) === false));
          if (createForm || indexForm) {
            entity = {
              type: 'project',
              id: req.projectId
            };
          }
        }
        return entity;
      },
      access: function (hasAccess, req, access) {
        var _debug = require('debug')('formio:settings:access');
        var _url = nodeUrl.parse(req.url).pathname;

        // Determine if the current request has access to the given Project.
        if (!Boolean(req.projectId)) {
          if (req.method === 'POST' && _url === '/project') {
            if (req.token) {
              // User is authenticated.
              _debug('true');
              return true;
            }

            // User is not authenticated and therefore cannot make a new project.
            return false;
          }

          _debug('Checking for Formio Access.');
          _debug('Formio URL: ' + _url);
          if (_url === '/current' || _url === '/logout') {
            if (req.token) {
              _debug('true');
              return true;
            }
          }

          if (_url === '/project') {
            if (req.token) {
              _debug('true');
              return true;
            }
          }

          if (_url === '/project/available') {
            _debug('true');
            return true;
          }

          if (_url === '/spec.json' || _url === '/spec.html') {
            _debug('true');
            return true;
          }

          // This req is unauthorized.
          _debug('false');
          return false;
        }
        else {
          _debug('Checking Project Access.');
          _debug('URL: ' + _url);
          var _access = formioServer.formio.access.hasAccess(req, access, {
            type: 'project',
            id: req.projectId
          });

          _debug(_access);
          return _access;
        }
      },
      hasAccess: function (_hasAccess, req, access) {
        if (req.token && access.project && access.project.owner) {
          if (req.token.user._id === access.project.owner) {
            if (
              (req.method === 'POST' || req.method === 'PUT') &&
              req.body.hasOwnProperty('owner') &&
              req.body.owner) {
              req.assignOwner = true;
            }

            // Allow the project owner to have access to everything.
            _hasAccess = true;
          }
        }
        return _hasAccess;
      },
      exportOptions: function (options, req, res) {
        var currentProject = cache.currentProject(req);
        options.title = currentProject.title;
        options.name = currentProject.name;
        options.description = currentProject.description;
        options.projectId = req.projectId || req.params.projectId || 0;
        return options;
      },
      requestParams: function (req, params) {
        var projectId = params.project;
        if (projectId && projectId === 'available') {
          projectId = null;
        }
        req.projectId = projectId;
        return params;
      },
      cors: function () {
        return require('../middleware/corsOptions')(formioServer)
      },
      formQuery: function (query, req) {
        req.projectId = req.projectId || req.params.projectId || 0;
        query.project = formioServer.formio.mongoose.Types.ObjectId(req.projectId);
        return query;
      },
      formSearch: function (search, model, value) {
        search.project = model.project;
        return search;
      },
      cacheInit: function (cache) {
        cache.projects = {};
        return cache;
      },
      submissionRequestQuery: function (query, req) {
        query.projectId = req.projectId;
        return query;
      },
      submissionRequestTokenQuery: function (query, token) {
        query.projectId = token.form.project;
        return query;
      },
      newRoleAccess: function (handlers, req) {
        var projectId = req.projectId;

        /**
         * Async function to add the new role to the read_all access of the project.
         *
         * @param done
         */
        var updateProject = function(_role, done) {
          var _debug = require('debug')('formio:settings:updateProject');

          formioServer.formio.resources.project.model.findOne({
            _id: formioServer.formio.mongoose.Types.ObjectId(projectId)
          }, function (err, project) {
            if (err) {
              _debug(err);
              return done(err);
            }
            if (!project) {
              _debug('No Project found with projectId: ' + projectId);
              return done();
            }

            // Add the new roleId to the access list for read_all (project).
            _debug('Loaded project: ' + JSON.stringify(project));
            project.access = project.access || [];
            var found = false;
            for (var a = 0; a < project.access.length; a++) {
              if (project.access[a].type === 'read_all') {
                project.access[a].roles = project.access[a].roles || [];
                project.access[a].roles.push(_role);
                project.access[a].roles = _.uniq(project.access[a].roles);
                found = true;
              }
            }

            // The read_all permission type was not previously added.
            if (!found) {
              project.access.push({
                type: 'read_all',
                roles: [_role]
              });
            }

            // Save the updated permissions.
            project.save(function(err) {
              if (err) {
                _debug(err);
                return done(err);
              }

              _debug('Updated Project: ' + JSON.stringify(project.toObject()));
              done();
            });
          });
        };

        // Update the project when new roles are added.
        handlers.unshift(updateProject);
        return handlers;
      },
      roleQuery: function (query, req) {
        var projectId = req.projectId || req.params.projectId;
        query.project = formioServer.formio.mongoose.Types.ObjectId(projectId);
        return query;
      },
      roleRoutes: function (routes) {
        routes.before.unshift(require('../middleware/bootstrapEntityProject'), require('../middleware/projectFilter'));
        return routes;
      },
      roleSearch: function (search, model, value) {
        search.project = model.project;
        return search;
      },
      roleSchema: function (schema) {
        schema.add({
          project: {
            type: formioServer.formio.mongoose.Schema.Types.ObjectId,
            ref: 'project',
            index: true,
            required: true
          }
        });
        return schema;
      }
    }
  }
};
