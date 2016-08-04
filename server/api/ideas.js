import Idea from '../../models/Idea';
import Assoc from '../../models/Assoc';

import * as Ideas from '../data/Ideas';
import * as Assocs from '../data/Assocs';

import express from 'express';
const api = express.Router();

api.get('/ideas', async function(req, res) {
    let data = await Ideas.get();
    res.send(data);
});

api.post('/ideas', async function(req, res) {
    let mindmapId = req.query.mmid;
    let parentIdeaId = req.query.piid;

    console.log(`create idea from parent (mm: ${mindmapId}): ${parentIdeaId}`);

    let newIdea = new Idea();
    newIdea.mindmapId = mindmapId;
    newIdea.x = 0;
    newIdea.y = 0;

    let assoc;
    if (parentIdeaId) {
        let parentIdea = await Ideas.findOne(parentIdeaId);

        newIdea.x = parentIdea.x + 100;
        newIdea.y = parentIdea.y + 100;

        assoc = new Assoc();
        
        assoc.mindmapId = mindmapId;
        assoc.from = parentIdea.id;
        assoc.to = newIdea.id;

        await Assocs.add(assoc);
    }

    await Ideas.add(newIdea);

    res.status(200).send({
        idea: newIdea,
        assoc: assoc
    });
});

api.put('/ideas', async function(req, res) {
    let idea = req.body;

    console.log(`update idea: ${idea.id}`);

    if (idea.isCentral) {
        let centralCount = Ideas.countCentral(idea.id);

        if (centralCount > 0) {
            throw Error(
                'Unable to set isCentral flag ' + 
                'because map already has central idea');
        }
    }

    let updatedIdea = await Ideas.update(idea);

    res.status(200).send({
        updated: {
            ideas: [updatedIdea],
            assocs: []
        }
    });
});

api.delete('/ideas/:iid', async function(req, res) {

    let ideaId = req.params.iid;

    console.log(`delete idea: ${ideaId}`);

    let idea = await Ideas.findOne(ideaId);
    if (idea.isCentral) {
        throw Error('Unable to delete central idea');
    }

    let assocsFrom = await Assocs.countFrom(ideaId);
    if (assocsFrom > 0) {
        throw Error('Unable to delete idea with association');
    }

    let deletedAssocId = await Assocs.remove(ideaId);
    let deletedIdeaId = await Ideas.remove(ideaId);

    res.status(200).send({
        deleted: {
            ideas: [deletedIdeaId],
            assocs: [deletedAssocId]
        }
    });
});

api.delete('/ideas', async function(req, res) {
    console.log(`delete ideas`);
    await Assocs.removeAll();
    await Ideas.removeAll();
    res.status(200).send();
});

export default api;