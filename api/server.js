'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;

const sendResponse = (res, statusCode, data, mimeType) => {
  res.statusCode = statusCode;
  res.setHeader('Content-type', mimeType);
  res.end(data);
};

const getMimeType = (ext) => {
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
    '.doc': 'application/msword'
  };

  return map[ext] || 'text/plain';
};

const errorHandler = (res, err) => {
  // sendResponse(res, 500, `Error getting the file: ${err}.`, getMimeType())
  // sendResponse(res, 404, `File ${pathname} not found!`, getMimeType());
  if (err.code === 'ENOENT') {
    return sendResponse(res, 404, `File ${err.path} not found!`, getMimeType());
  } else {
    return sendResponse(res, 500, `Error getting the file: ${err.message}.`, getMimeType());
  }
};

const sendFile = (res, pathname) => {
  // Read file from file system.
  fs.readFile(pathname, (err, data) => {
    if (err) {
      return errorHandler(res, err);
    }

    // Based on the URL path, extract the file extention. e.g. .js, .doc, ...
    const ext = path.parse(pathname).ext;

    // If the file is found, set Content-type and send data.
    return sendResponse(res, 200, data, getMimeType(ext));
  });
};

const requestListener = (req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Parse URL.
  const parsedUrl = url.parse(req.url);
  // Extract URL path.
  let pathname = path.join(__dirname, '../public', `.${parsedUrl.pathname}`);

  fs.stat(pathname, (err, stats) => {
    if (err) {
      return errorHandler(res, err);
    }

    if (stats.isDirectory()) {
      // If is a directory search for index HTML file.
      pathname = path.join(pathname, 'index.html');

      fs.stat(pathname, (err, stats) => {
        if (err) {
          return errorHandler(res, err);
        }

        return sendFile(res, pathname);
      });
    } else {
      // If it is not directory, it is a file, just send it.
      return sendFile(res, pathname);
    }
  });
};

http
  .createServer(requestListener)
  .listen(parseInt(port));

console.log(`Server listening on http://localhost:${port}/`);
