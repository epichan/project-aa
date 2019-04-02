'use strict';

const app = require('./http-server')();
const serveStatic = require('./middlewares/serve-static');
const bodyParser = require('./middlewares/body-parser');

app.use(serveStatic('public/'));
app.use(bodyParser());

// Configure API endpoints.
require('./routes')(app);

app.use((req, res) => {
  const statusCode = 404;
  const data = {
    status: statusCode,
    message: 'Not found'
  };

  res.statusCode = statusCode;
  res.setHeader('Content-type', 'application/json');
  res.end(JSON.stringify(data));
});

module.exports = app;
