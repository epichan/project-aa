'use strict';

const fs = require('fs');
const path = require('path');

const routeMiddleware = (route) => {
  return (req, res, next) => {
    if (req.method === route.method && req.url === route.url) {
      return route.controller(req, res);
    } else {
      return next();
    }
  };
};

const setupRoute = (app, file) => {
  const route = require(path.join(__dirname, file));

  app.use(routeMiddleware(route));
};

module.exports = function routes (app) {
  fs
    .readdirSync(__dirname)
    .filter(dir => dir !== 'index.js')
    .forEach(setupRoute.bind(null, app));
};
