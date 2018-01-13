// @ts-ignore relative path from build folder
import config from '../config.serve';

import express from 'express';
import logger from 'morgan';
import compression from 'compression';

const app = express();

// compress all responses
// Q: why compress on the fly and not pre-compress when building?
// A: it is not worth the trouble since we will use aggressive client side
//    caching (service worker cache). and the trouble is that some files do not
//    need additional compression (eg. woff fonts) which is determined by
//    compressor dynamically, but urls are not updated dynamically
//    (ie. url-loader does not respect .gz extension added to compressed files
//     by compression-webpack-plugin, which result in 404s. and if do not modify
//     filename we will not know when to add 'Content-Encoding' response header)
app.use(compression());

app.use(logger('dev'));

app.use(express.static(config.server.static.folder));

app.use(function(req, res) {
    res.status(404);
    res.send('NOT FOUND');
});

app.use(function(err, req, res) {
    res.status(500);
    res.render('error', {error: err});
});

const {host, port} = config.server.static;
app.listen(port, host, function(err) {
    if (err) {
        throw Error(err);
    }
    console.log(`Server started\n` +
        `    serving folder: ${config.server.static.folder}\n` +
        `    listening at ${host}:${port}`);
});

/* global process */
process.on('unhandledRejection', function(reason) {
    console.error('[Unhandled Rejection]:', reason.stack);
});