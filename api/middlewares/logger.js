'use strict';

module.exports = function logger () {
  return (req, res, next) => {
    console.log(`${req.method} ${req.url}`);

    return next();
  };
};
