import * as Assocs from '../data/Assocs';

import express from 'express';
const api = express.Router();

api.get('/assocs', async function(req, res) {
    let data = await Assocs.get();
    res.send(data);
});

api.put('/assocs', function(req, res) {
    let assoc = req.body;

    console.log(`update assoc: ${assoc.id}`);
    Assocs.update(assoc);
    res.status(200).send();
});

export default api;