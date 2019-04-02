'use strict';

module.exports = {
  method: 'POST',
  url: '/api/login',
  controller: (req, res) => {
    const statusCode = 200;
    const data = {
      status: statusCode,
      data: 'Mock data for login'
    };

    res.statusCode = statusCode;
    res.setHeader('Content-type', 'application/json');
    res.end(JSON.stringify(data));
  }
};
