import express from 'express';
import logger from 'morgan';

import ideas from './api/ideas';
import associations from './api/associations';
import mindmaps from './api/mindmaps';

import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(logger('dev'));

app.use('/api', ideas);
app.use('/api', associations);
app.use('/api', mindmaps);

app.use(express.static('client'));

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