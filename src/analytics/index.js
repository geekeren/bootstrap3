'use strict';

var Redis = require('redis');
var onFinished = require('on-finished');
var debug = {
  record: require('debug')('formio:analytics:record'),
  hook: require('debug')('formio:analytics:hook'),
  getCalls: require('debug')('formio:analytics:getCalls')
};
var url = require('url');

/**
 *
 * @param config
 * @returns {{record: Function}}
 */
module.exports = function(config) {
  var redis = null;

  // Configure the redis connection.
  if (config.redis && config.redis.port && config.redis.address) {
    var opts = {};
    if (config.redis.password) {
      opts.auth_pass = config.redis.password;
    }

    redis = Redis.createClient(config.redis.port, config.redis.address, opts);
  }

  /**
   * Express middleware for tracking request analytics.
   *
   * @param project {String}
   *   The Project Id of this request.
   * @param path {String}
   *   The requested url for this request.
   */
  var record = function(project, path, start) {
    if (!redis) {
      debug.record('Skipping');
      return;
    }
    if (!project) {
      debug.record('Skipping non-project request: ' + path);
      return;
    }
    if (!path) {
      debug.record('Skipping request, unknown path: ' + path);
      return;
    }

    var now = new Date();
    var key = now.getUTCMonth() + ':' + project;
    debug.record('Start: ' + start);
    debug.record('dt: ' + (now.getTime() - Number.parseInt(start, 10)).toString());
    var delta = start
      ? now.getTime() - start
      : 0;
    var value = path + ':' + now.getTime() + ':' + delta;

    redis.rpush(key, value, function(err, length) {
      if (err) {
        console.error(err);
        return;
      }

      debug.record(key + ' => ' + value + ' => ' + length);
    });
  };

  /**
   * Hook the response and record the event in redis, after the response is sent.
   *
   * @param req
   * @param res
   * @param next
   */
  var hook = function(req, res, next) {
    // Attach the request start time.
    req._start = (new Date()).getTime();
    debug.hook(req._start);

    onFinished(res, function(err) {
      if (err) {
        debug.hook(err);
        return;
      }
      if (!req.projectId) {
        debug.hook('No projectId found in the request, skipping redis record.');
        return;
      }

      var id = req.projectId;
      var path = url.parse(req.url).pathname;
      var start = req._start;
      record(id, path, start);
    });

    next();
  };

  /**
   * Get the number of calls made for the given month and project.
   *
   * @param month {number|string}
   *   The month number to search for (0-11).
   * @param project {string}
   *   The Project Id to search for.
   */
  var getCalls = function(month, project, next) {
    if (!redis || !month || !project) {
      req.getCalls('Skipping');
      return next();
    }

    var key = month.toString() + ':' + project.toString();
    redis.llen(key, function(err, value) {
      if (err) {
        return next(err);
      }

      debug.getCalls(key + ' -> ' + value);
      next(null, value);
    });
  };

  /**
   * Expose the redis interface for analytics.
   */
  return {
    hook: hook,
    getCalls: getCalls
  };
};
