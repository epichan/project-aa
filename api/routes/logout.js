'use strict';

module.exports = {
  method: 'DELETE',
  url: '/api/logout',
  controller: (req, res) => {
    const statusCode = 200;
    const data = {
      status: statusCode,
      data: 'Mock data for logout'
    };

    res.statusCode = statusCode;
    res.setHeader('Content-type', 'application/json');
    res.end(JSON.stringify(data));
  }
};
