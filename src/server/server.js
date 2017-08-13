import config from '../../config.js';

import express from 'express';
import logger from 'morgan';

const app = express();
app.use(logger('dev'));

app.use(express.static(config.src.serv.public));

app.use(function(req, res) {
    res.status(404);
    res.send('NOT FOUND');
});

app.use(function(err, req, res) {
    res.status(500);
    res.render('error', {error: err});
});

const {host, port} = config.server;
app.listen(port, host, function(err) {
    if (err) {
        throw Error(err);
    }
    console.log(`Listening at ${host}:${port}`);
});

/* global process */
process.on('unhandledRejection', function(reason) {
    console.error('[Unhandled Rejection]:', reason.stack);
});