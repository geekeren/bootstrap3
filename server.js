'use strict';

require('dotenv').load({silent: true});
var config = require('./config')();
var express = require('express');
var nunjucks = require('nunjucks');
var vhost = require('vhost');
var _ = require('lodash');
var app = express();

// Configure nunjucks.
nunjucks.configure('server/views', {
  autoescape: true,
  express: app
});

// Make sure to redirect all http requests to https.
app.use(function(req, res, next) {
  if (!config.https || req.secure || (req.get('X-Forwarded-Proto') === 'https') || req.url === '/health') {
    return next();
  }

  res.redirect('https://' + req.get('Host') + req.url);
});

// CORS Support
app.use(require('cors')());

// Host the dynamic app configuration.
app.get('/config.js', function(req, res) {
  res.set('Content-Type', 'text/javascript');
  res.render('js/config.js', {
    forceSSL: config.https ? 'true' : 'false',
    domain: config.formio.domain,
    appHost: config.host,
    apiHost: config.apiHost,
    formioHost: config.formioHost
  });
});

// Mount bower_components as assets.
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// Mount getting started presentation.
app.use('/start', express.static(__dirname + '/server/start'));

// Mount the brochure.
app.use('/', express.static(__dirname + '/src/brochure'));

// Include the swagger ui.
app.use('/swagger', express.static(require('swagger-ui').dist));

// Mount all of our apps.
var apps = require('./apps/index');
_.each(apps, function(path, name) {
  app.use('/apps/' + name, express.static(path));
});

// Add the formio Project.
app.use('/app', express.static(__dirname + '/dist'));

// Show the docs page for the API.
app.get('/spec.html', function (req, res, next) {
  res.render('docs.html', {
    url: '/spec.json'
  });
});

// Get the specs for each form.
app.get('/project/:projectId/form/:formId/spec.html', function (req, res, next) {
  res.render('docs.html', {
    url: '/project/' + req.params.projectId + '/form/' + req.params.formId + '/spec.json'
  });
});

// Mount the api server.
require('formio')(config.formio, function(formio) {
  // Route all subdomain requests to the API server.
  app.use(vhost('*.' + config.formio.domain, formio));

  // Mount the Formio API server at the root.
  app.use('/', formio);

  console.log(' > Listening to ' + config.host);
  app.listen(config.port);
});
