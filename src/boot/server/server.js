import fs from 'fs';
import http from 'http';
import https from 'https';

import express from 'express';
import logger from 'morgan';
import compression from 'compression';
import consolidate from 'consolidate';
import table from 'text-table';
import bodyParser from 'body-parser';

// @ts-ignore relative path from build folder
import config from '../config.serve';
// @ts-ignore relative path from build folder
import pkg from '../package.json';

import auth from './auth';

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

// setup template engine
app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', config.server.static.folder);

app.get('/', function(req, res) {
  // inject runtime client config to the index page on the fly.
  // Q: why not pre-build config?
  // A: this is the best option I found so far. another options:
  //  - inject config once at build time - won't work since it blocks
  //    configuration of already deployed build (away from sources)
  //  - inject config once just before serve (with gulp task) - won't work since
  //    it blocks running server directly without gulp task
  //  - make rest api request for config from client at startup - won't work
  //    since (a) it is additional request which will hit load performance
  //    (b) and will block offline scenario
  const clientConfig = {
    app: {
      name: pkg.name,
      homepage: pkg.homepage,
      version: pkg.version
    },
    dbServer: {
      protocol: config.server.database.protocol,
      host: config.server.database.host,
      port: config.server.database.port
    },
    regInviteRequired: config.client.reg.invite.on
  };

  res.render('index', {
    clientConfig: JSON.stringify(clientConfig)
  });
});

app.use(express.static(config.server.static.folder));
app.use('/auth', auth);

app.use(function(req, res) {
  res.status(404).send('NOT FOUND');
});

// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
  console.error(err);
  res.status(500).send();
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

/* global process */
process.on('unhandledRejection', function(reason) {
  console.error('[Unhandled Rejection]:', reason.stack);
});
