'use strict';

const url = require('url');

module.exports = function bodyParser () {
  const methods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  return (req, res, next) => {
    req.query = url.parse(req.url, true).query;

    if (methods.includes(req.method)) {
      const data = [];

      req.on('data', chunk => {
        // TODO: Validate a payload limit.
        data.push(chunk);
      });

      req.on('end', () => {
        if (data.length) {
          req.body = JSON.parse(data);
        } else {
          req.body = {};
        }

        return next();
      });
    } else {
      return next();
    }
  };
};
