'use strict';

module.exports = {
  method: 'POST',
  url: '/api/sign-up',
  controller: (req, res) => {
    const statusCode = 200;
    const data = {
      status: statusCode,
      data: 'Mock data for sign up'
    };

    res.statusCode = statusCode;
    res.setHeader('Content-type', 'application/json');
    res.end(JSON.stringify(data));
  }
};
