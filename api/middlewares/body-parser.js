'use strict';

const url = require('url');

module.exports = function bodyParser () {
  const methods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  return (ctx, next) => {
    ctx.query = url.parse(ctx.req.url, true).query;

    if (methods.includes(ctx.req.method)) {
      const data = [];

      ctx.req.on('data', chunk => {
        // TODO: Validate a payload limit.
        data.push(chunk);
      });

      ctx.req.on('end', () => {
        if (data.length) {
          ctx.body = JSON.parse(data);
        } else {
          ctx.body = {};
        }

        return next();
      });
    } else {
      return next();
    }
  };
};
