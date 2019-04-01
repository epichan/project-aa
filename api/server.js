'use strict';

const app = require('./app');

const options = {
  host: process.env.HOST || 'localhost',
  port: +(process.env.PORT || 8080)
};

app.listen(options, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log(`Server listening on http://${options.host}:${options.port}/`);
});
