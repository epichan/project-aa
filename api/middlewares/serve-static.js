'use strict';

const url = require('url');
const fs = require('fs');
const path = require('path');

const sendResponse = (req, res, statusCode, data, mimeType) => {
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

const errorHandler = (req, res, err, next) => {
  if (err.code === 'ENOENT') {
    if (next) {
      return next();
    } else {
      return sendResponse(req, res, 404, `File ${err.path} not found!`, getMimeType());
    }
  } else {
    return sendResponse(req, res, 500, `Error getting the file: ${err.message}.`, getMimeType());
  }
};

const sendFile = (req, res, pathname) => {
  // Read file from file system.
  fs.readFile(pathname, (err, data) => {
    if (err) {
      return errorHandler(req, res, err, null);
    }

    // Based on the URL path, extract the file extention. e.g. .js, .doc, ...
    const ext = path.parse(pathname).ext;

    // If the file is found, set Content-type and send data.
    return sendResponse(req, res, 200, data, getMimeType(ext));
  });
};

module.exports = function serveStatic (root) {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    // Parse URL.
    const parsedUrl = url.parse(req.url);
    // Extract URL path.
    let pathname = path.resolve(root, `.${parsedUrl.pathname}`);

    fs.stat(pathname, (err, stats) => {
      if (err) {
        return errorHandler(req, res, err, next);
      }

      if (stats.isDirectory()) {
        // If is a directory search for index HTML file.
        pathname = path.join(pathname, 'index.html');

        fs.stat(pathname, (err, stats) => {
          if (err) {
            return errorHandler(req, res, err, next);
          }

          return sendFile(req, res, pathname);
        });
      } else {
        // If it is not directory, it is a file, just send it.
        return sendFile(req, res, pathname);
      }
    });
  };
};
