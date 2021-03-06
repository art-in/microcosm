import fs from 'fs';
import http from 'http';
import https from 'https';

import express from 'express';
import logger from 'morgan';
import compression from 'compression';
import table from 'text-table';
import bodyParser from 'body-parser';
import HttpStatus from 'http-status-codes';

// @ts-ignore relative path from build folder
import config from '../config';

import api from './api';
import apiAuth from './api-auth';

const app = express();

// compress all responses on the fly.
// Q: why not pre-compress files when building?
// A: it is not worth the trouble since we use aggressive client side caching
//    (service worker cache). and the trouble is that some files do not need
//    additional compression (eg. woff fonts) which is determined by compressor
//    dynamically, but urls are not get updated accordingly (ie. url-loader does
//    not respect .gz extension added by compression-webpack-plugin to
//    compressed files, which results in 404s. and if we skip adding extension,
//    we do not know when to add 'Content-Encoding' response header)
app.use(compression());

app.use(bodyParser.json());
app.use(logger(config.server.static.logFormat));

app.use(express.static(config.server.static.folder));

app.use('/api', api);
app.use('/api/auth', apiAuth);

app.use(function(req, res) {
  res.status(HttpStatus.NOT_FOUND).send();
});

// global error handler
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
  console.error(err);
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
});

const {host, port, folder, secure} = config.server.static;

let server;
if (secure.enabled) {
  server = https.createServer(
    {
      key: fs.readFileSync(secure.key),
      cert: fs.readFileSync(secure.cert)
    },
    app
  );
} else {
  server = http.createServer(app);
}

server.listen(port, host, function(err) {
  if (err) {
    throw Error(err);
  }

  const scheme = secure.enabled ? 'https' : 'http';

  console.log(
    `Server started\n` +
      table([
        ['\t serving folder', folder],
        ['\t key file', secure.enabled ? secure.key : '---'],
        ['\t cert file', secure.enabled ? secure.cert : '---'],
        ['\t listening at', `${scheme}://${host}:${port}`]
      ])
  );
});

process.on('unhandledRejection', function(reason) {
  console.error('[Unhandled Rejection]:', reason.stack);
});
