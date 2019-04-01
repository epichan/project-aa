'use strict';

const app = require('./http-server')();
const serveStatic = require('./middlewares/serve-static');
const bodyParser = require('./middlewares/body-parser');

app.use(serveStatic('public/'));
app.use(bodyParser());

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
