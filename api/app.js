'use strict';

const app = require('./http-server')();

app.use((ctx) => {
  const statusCode = 404;
  const data = {
    status: statusCode,
    message: 'Not found'
  };

  ctx.res.statusCode = statusCode;
  ctx.res.setHeader('Content-type', 'application/json');
  ctx.res.end(JSON.stringify(data));
});

module.exports = app;
