'use strict';

const url = require('url');
const fs = require('fs');
const path = require('path');

const sendResponse = (ctx, statusCode, data, mimeType) => {
  ctx.res.statusCode = statusCode;
  ctx.res.setHeader('Content-type', mimeType);
  ctx.res.end(data);
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

const errorHandler = (ctx, err, next) => {
  if (err.code === 'ENOENT') {
    if (next) {
      return next();
    } else {
      return sendResponse(ctx, 404, `File ${err.path} not found!`, getMimeType());
    }
  } else {
    return sendResponse(ctx, 500, `Error getting the file: ${err.message}.`, getMimeType());
  }
};

const sendFile = (ctx, pathname) => {
  // Read file from file system.
  fs.readFile(pathname, (err, data) => {
    if (err) {
      return errorHandler(ctx, err, null);
    }

    // Based on the URL path, extract the file extention. e.g. .js, .doc, ...
    const ext = path.parse(pathname).ext;

    // If the file is found, set Content-type and send data.
    return sendResponse(ctx, 200, data, getMimeType(ext));
  });
};

module.exports = function serveStatic (root) {
  return (ctx, next) => {
    if (ctx.req.method !== 'GET') {
      return next();
    }

    // Parse URL.
    const parsedUrl = url.parse(ctx.req.url);
    // Extract URL path.
    let pathname = path.resolve(root, `.${parsedUrl.pathname}`);

    fs.stat(pathname, (err, stats) => {
      if (err) {
        return errorHandler(ctx, err, next);
      }

      if (stats.isDirectory()) {
        // If is a directory search for index HTML file.
        pathname = path.join(pathname, 'index.html');

        fs.stat(pathname, (err, stats) => {
          if (err) {
            return errorHandler(ctx, err, next);
          }

          return sendFile(ctx, pathname);
        });
      } else {
        // If it is not directory, it is a file, just send it.
        return sendFile(ctx, pathname);
      }
    });
  };
};
