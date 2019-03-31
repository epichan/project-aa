'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;

http.createServer(function (req, res) {
  console.log(`${req.method} ${req.url}`);

  // Parse URL.
  const parsedUrl = url.parse(req.url);
  // Extract URL path.
  let pathname = path.join(__dirname, '../public', `.${parsedUrl.pathname}`);
  // Maps file extention to MIME type.
  const map = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '': 'text/plain' // Default MIME type, for errors.
  };

  fs.exists(pathname, function (exist) {
    if(!exist) {
      // If the file is not found, return 404.
      res.statusCode = 404;
      res.setHeader('Content-type', map[''] );
      res.end(`File ${pathname} not found!`);
      return;
    }

    // If is a directory search for index HTML file.
    if (fs.statSync(pathname).isDirectory()) {
      pathname = path.join(pathname, 'index.html');
    }

    // Read file from file system.
    fs.readFile(pathname, function(err, data) {
      if(err){
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.setHeader('Content-type', map[''] );
          res.end(`File ${pathname} not found!`);
        } else {
          res.statusCode = 500;
          res.setHeader('Content-type', map[''] );
          res.end(`Error getting the file: ${err}.`);
        }
      } else {
        // Based on the URL path, extract the file extention. e.g. .js, .doc, ...
        const ext = path.parse(pathname).ext;

        // If the file is found, set Content-type and send data.
        res.setHeader('Content-type', map[ext] );
        res.end(data);
      }
    });
  });
}).listen(parseInt(port));

console.log(`Server listening on http://localhost:${port}/`);
