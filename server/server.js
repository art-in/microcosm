import express from 'express';
import logger from 'morgan';

import ideas from './api/ideas';
import assocs from './api/assocs';
import mindmaps from './api/mindmaps';

import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(logger('dev'));

app.use('/api', ideas);
app.use('/api', assocs);
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
    console.log('Server started on http://localhost:3000');
});

process.on('unhandledRejection', function(reason) {
    console.log('[Unhandled Rejection]:', reason.stack);
});