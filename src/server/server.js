import config from '../../gulpfile.config.js';

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

app.listen(3000, function() {
    // eslint-disable-next-line no-console
    console.log('Server started on http://localhost:3000');
});

/* global process */
process.on('unhandledRejection', function(reason) {
    console.error('[Unhandled Rejection]:', reason.stack);
});