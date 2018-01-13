// @ts-ignore relative path from build folder
import config from '../config.serve';

import express from 'express';
import logger from 'morgan';
import compression from 'compression';
import consolidate from 'consolidate';

const app = express();

// compress all responses on the fly.
// Q: why compress on the fly and not pre-build?
// A: it is not worth the trouble since we will use aggressive client side
//    caching (service worker cache). and the trouble is that some files do not
//    need additional compression (eg. woff fonts) which is determined by
//    compressor dynamically, but urls are not updated dynamically
//    (ie. url-loader does not respect .gz extension added to compressed files
//     by compression-webpack-plugin, which result in 404s. and if do not modify
//     filename we will not know when to add 'Content-Encoding' response header)
app.use(compression());

app.use(logger('dev'));

// setup template engine
app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', config.server.static.folder);

app.get('/', function(req, res) {

    // inject runtime config to the index page on the fly.
    // Q: why inject on the fly and not pre-build?
    // A: this is the best option I found so far. another options:
    //  - inject config once at build time - won't work since it blocks
    //    configuration of already deployed build (away from sources)
    //  - inject config once just before serve - won't work since it blocks
    //    running server without gulp task
    //  - make rest api request for config from client at startup - won't work
    //    since (a) it is additional request which will hit load performance
    //    (b) it will block offline scenario
    const runtimeConfig = {
        dbServer: {
            host: config.server.database.host,
            port: config.server.database.port
        }
    };

    res.render('index', {
        baseUrl: config.server.static.baseUrl,
        runtimeConfig: JSON.stringify(runtimeConfig)
    });
});

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
        `\tserving folder: ${config.server.static.folder}\n` +
        `\tlistening at ${host}:${port}`);
});

/* global process */
process.on('unhandledRejection', function(reason) {
    console.error('[Unhandled Rejection]:', reason.stack);
});