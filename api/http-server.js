'use strict';

const http = require('http');

const middlewares = [];

const callMiddlewares = (req, res, middlewares) => {
  if (res.finished || req.finished) {
    return;
  }

  if (!middlewares.length) {
    return res.end();
  }

  return middlewares[0](req, res, callMiddlewares.bind(null, req, res, middlewares.slice(1)));
};

const requestListener = (req, res) => {
  return callMiddlewares(req, res, middlewares);
};

module.exports = function httpServer () {
  const app = http.createServer(requestListener);

  app.use = (middleware) => {
    middlewares.push(middleware);
  };

  return app;
};
