'use strict';

const http = require('http');

const middlewares = [];

const callMiddlewares = (ctx, middlewares) => {
  if (ctx.res.finished || ctx.req.finished) {
    return;
  }

  if (!middlewares.length) {
    return ctx.res.end();
  }

  return middlewares[0](ctx, callMiddlewares.bind(null, ctx, middlewares.slice(1)));
};

const requestListener = (req, res) => {
  const ctx = {
    req,
    res
  };

  return callMiddlewares(ctx, middlewares);
};

module.exports = function httpServer () {
  const app = http.createServer(requestListener);

  app.use = (middleware) => {
    middlewares.push(middleware);
  };

  return app;
};
