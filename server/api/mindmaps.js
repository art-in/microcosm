import * as Mindmaps from '../data/Mindmaps';

import express from 'express';
const api = new express.Router();

api.get('/mindmaps', async function(req, res) {
    const data = await Mindmaps.get();
    res.send(data);
});

api.post('/mindmaps', async function(req, res) {
    const mindmap = req.body;
    await Mindmaps.add(mindmap);
    res.status(200).send();
});

api.put('/mindmaps', async function(req, res) {
    const mindmap = req.body;
    await Mindmaps.update(mindmap);
    res.status(200).send();
});

export default api;