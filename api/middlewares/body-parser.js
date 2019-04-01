'use strict';

module.exports = function bodyParser () {
  const methods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  return (ctx, next) => {
    if (methods.includes(ctx.req.method)) {
      const data = [];

      ctx.req.on('data', chunk => {
        // TODO: Validate a payload limit.
        data.push(chunk);
      });

      ctx.req.on('end', () => {
        if (data.length) {
          ctx.req.body = JSON.parse(data);
        } else {
          ctx.req.body = {};
        }

        next();
      });
    } else {
      return next();
    }
  };
};
