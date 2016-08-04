import * as Mindmaps from '../data/Mindmaps';

import express from 'express';
const api = express.Router();

api.get('/mindmaps', async function(req, res) {
    let data = await Mindmaps.get();
    res.send(data);
});

api.post('/mindmaps', async function(req, res) {
    let mindmap = req.body;
    await Mindmaps.add(mindmap);
    res.status(200).send();
});

api.put('/mindmaps', async function(req, res) {
    let mindmap = req.body;
    await Mindmaps.update(mindmap);
    res.status(200).send();
});

export default api;