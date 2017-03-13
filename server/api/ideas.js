import Idea from '../../models/Idea';
import Association from '../../models/Association';

import * as Ideas from '../data/Ideas';
import * as Associations from '../data/Associations';

import express from 'express';
const api = new express.Router();

api.get('/ideas', async function(req, res) {
    const data = await Ideas.get();
    res.send(data);
});

api.post('/ideas', async function(req, res) {
    const mindmapId = req.query.mmid;
    const parentIdeaId = req.query.piid;

    console.log(`create idea from parent (mm: ${mindmapId}): ${parentIdeaId}`);

    const newIdea = new Idea();
    newIdea.mindmapId = mindmapId;
    newIdea.x = 0;
    newIdea.y = 0;

    let assoc;
    if (parentIdeaId) {
        const parentIdea = await Ideas.findOne(parentIdeaId);

        newIdea.x = parentIdea.x + 100;
        newIdea.y = parentIdea.y + 100;

        assoc = new Association();
        
        assoc.mindmapId = mindmapId;
        assoc.from = parentIdea.id;
        assoc.to = newIdea.id;

        await Associations.add(assoc);
    }

    await Ideas.add(newIdea);

    res.status(200).send({
        idea: newIdea,
        assoc: assoc
    });
});

api.put('/ideas', async function(req, res) {
    const idea = req.body;

    console.log(`update idea: ${idea.id}`);

    if (idea.isCentral) {
        const centralCount = Ideas.countCentral(idea.id);

        if (centralCount > 0) {
            throw Error(
                'Unable to set isCentral flag ' +
                'because map already has central idea');
        }
    }

    const updatedIdea = await Ideas.update(idea);

    res.status(200).send({
        updated: {
            ideas: [updatedIdea],
            assocs: []
        }
    });
});

api.delete('/ideas/:iid', async function(req, res) {

    const ideaId = req.params.iid;

    console.log(`delete idea: ${ideaId}`);

    const idea = await Ideas.findOne(ideaId);
    if (idea.isCentral) {
        throw Error('Unable to delete central idea');
    }

    const assocsFrom = await Associations.countFrom(ideaId);
    if (assocsFrom > 0) {
        throw Error('Unable to delete idea with association');
    }

    const deletedAssocId = await Associations.remove(ideaId);
    const deletedIdeaId = await Ideas.remove(ideaId);

    res.status(200).send({
        deleted: {
            ideas: [deletedIdeaId],
            assocs: [deletedAssocId]
        }
    });
});

api.delete('/ideas', async function(req, res) {
    console.log(`delete ideas`);
    await Associations.removeAll();
    await Ideas.removeAll();
    res.status(200).send();
});

export default api;