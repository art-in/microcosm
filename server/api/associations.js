import * as Associations from '../data/Associations';

import express from 'express';
const api = new express.Router();

api.get('/assocs', async function(req, res) {
    const data = await Associations.get();
    res.send(data);
});

api.put('/assocs', function(req, res) {
    const assoc = req.body;

    console.log(`update assoc: ${assoc.id}`);
    Associations.update(assoc);
    res.status(200).send();
});

export default api;