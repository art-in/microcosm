import {mapObject} from 'lib/helpers/helpers';

import * as ideaStorage from 'storage/ideas';
import * as assocStorage from 'storage/associations';
import * as mindmapStorage from 'storage/mindmaps';

import buildGraph from 'lib/graph/build-ideas-graph';
import getMapValues from 'lib/helpers/get-map-values';

/**
 * Applies patch to model state
 * @param {object} model
 * @param {Patch} patch
 * @return {object} new model state
 */
export default async function mutate(model, patch) {
    
    let mutated = model;

    await Promise.all(patch.map(async function(mutation) {
        mutated = await apply(mutated, mutation);
    }));

    return mutated;
}

/**
 * Applies single mutation to state
 * 
 * @param {{mindmap}} model
 * @param {{type, data}} mutation
 * @return {object} new model state
 */
async function apply(model, mutation) {

    switch (mutation.type) {

    case 'init':
        model = await init(model, mutation);
        break;

    case 'add idea':
        model = await addIdea(model, mutation);
        break;

    case 'update idea':
        model = await updateIdea(model, mutation);
        break;

    case 'remove idea':
        model = await removeIdea(model, mutation);
        break;

    case 'add association':
        model = await addAssociation(model, mutation);
        break;

    case 'update association':
        model = await updateAssociation(model, mutation);
        break;

    case 'remove association':
        model = await removeAssociation(model, mutation);
        break;

    case 'update mindmap':
        model = await updateMindmap(model, mutation);
        break;

    default:
        throw Error(`Unknown mutation '${mutation.type}'`);
    }

    return model;
}

/**
 * Handles 'init' mutation
 * @param {object} model 
 * @param {object} mutation 
 * @return {object} model
 */
async function init(model, mutation) {
    const {db} = mutation.data;
    
    // data
    const ideas = await ideaStorage.getAll(db.ideas);
    const assocs = await assocStorage.getAll(db.associations);
    const mindmaps = await mindmapStorage.getAll(db.mindmaps);

    if (mindmaps.length === 0) {
        throw Error('Mindmap database is empty');
    }

    // TDB: get first mindmap
    const mindmap = mindmaps[0];

    mindmap.root = buildGraph(ideas, assocs);
    
    assocs.forEach(a => mindmap.associations.set(a.id, a));
    ideas.forEach(i => mindmap.ideas.set(i.id, i));

    model.mindmap = mindmap;

    return model;
}

/**
 * Handles 'add idea' mutation
 * @param {object} model 
 * @param {object} mutation 
 * @return {object} model
 */
async function addIdea(model, mutation) {
    const {mindmap} = model;
    const idea = mutation.data;

    mindmap.ideas.set(idea.id, idea);

    if (idea.isCentral) {

        // add root idea
        if (mindmap.root) {
            throw Error('Mindmap already has root idea');
        }

        mindmap.root = idea;

        // no incomming associations needed
        // for root idea
        idea.associationsIn = [];

    } else {

        // bind with incoming associations
        const incomingAssocs = getMapValues(mindmap.associations)
            .filter(a => a.toId === idea.id);
    
        if (!incomingAssocs.length) {
            // incoming association should be added first.
            // hanging ideas are not allowed
            throw Error(
                `No incoming associations found for idea '${idea.id}'`);
        }

        incomingAssocs.forEach(a => a.to = idea);
        idea.associationsIn = incomingAssocs;
    }

    idea.associationsOut = [];

    return model;
}

/**
 * Handles 'update idea' mutation
 * @param {object} model 
 * @param {object} mutation 
 * @return {object} model
 */
async function updateIdea(model, mutation) {
    const {mindmap} = model;
    const patch = mutation.data;

    const idea = mindmap.ideas.get(patch.id);

    if (!idea) {
        throw Error(`Idea '${patch.id}' was not found`);
    }

    mapObject(idea, patch);
    return model;
}

/**
 * Handles 'remove idea' mutation
 * @param {object} model 
 * @param {object} mutation 
 * @return {object} model
 */
async function removeIdea(model, mutation) {
    const {mindmap} = model;
    const {id} = mutation.data;

    const idea = mindmap.ideas.get(id);

    // unbind from incoming associations
    if (!idea.isCentral &&
        (!idea.associationsIn || !idea.associationsIn.length)) {
        throw Error(`No incoming associations found for idea '${idea.id}'`);
    }

    idea.associationsIn.forEach(a => {
        a.toId = null;
        a.to = null;
    });
    idea.associationsIn = null;

    mindmap.ideas.delete(id);

    return model;
}

/**
 * Handles 'add association' mutation
 * @param {object} model 
 * @param {object} mutation 
 * @return {object} model
 */
async function addAssociation(model, mutation) {
    const {mindmap} = model;
    const assoc = mutation.data;

    mindmap.associations.set(assoc.id, assoc);

    // bind with head idea
    const head = mindmap.ideas.get(assoc.fromId);
    if (!head) {
        throw Error(
            `Head idea '${assoc.fromId}' was not found for association`);
    }

    assoc.from = head;
    head.associationsOut = head.associationsOut || [];
    head.associationsOut.push(assoc);

    // bind with tail idea
    const tail = mindmap.ideas.get(assoc.toId);

    // do not throw if tail was not found.
    // tail idea can be not added yet
    // in scenario of creating new idea
    // (new association added before new idea)
    if (tail) {
        assoc.to = tail;
        tail.associationsIn = tail.associationsIn || [];
        tail.associationsIn.push(assoc);
    }

    return model;
}

/**
 * Handles 'update association' mutation
 * @param {object} model 
 * @param {object} mutation 
 * @return {object} model
 */
async function updateAssociation(model, mutation) {
    const {mindmap} = model;
    const patch = mutation.data;

    const assoc = mindmap.associations.get(patch.id);

    if (!assoc) {
        throw Error(`Association '${patch.id}' was not found`);
    }

    mapObject(assoc, patch);
    
    return model;
}

/**
 * Handles 'remove association' mutation
 * @param {object} model 
 * @param {object} mutation 
 * @return {object} model
 */
async function removeAssociation(model, mutation) {
    const {mindmap} = model;
    const {id} = mutation.data;

    const assoc = mindmap.associations.get(id);

    if (!assoc) {
        throw Error(`Association '${id}' was not found`);
    }

    // remove from map
    mindmap.associations.delete(id);

    // unbind from head idea
    if (!assoc.from) {
        throw Error(`Association '${id}' has no reference to head idea`);
    }

    const headIdeaAssocsOut = assoc.from.associationsOut;
    const index = headIdeaAssocsOut.indexOf(assoc);

    if (index === -1) {
        throw Error(
            `Head idea '${assoc.from.id}' has no reference ` +
            `to outgoing association '${id}'`);
    }

    headIdeaAssocsOut.splice(index, 1);

    assoc.fromId = null;
    assoc.from = null;

    if (assoc.to) {
        // tail idea should be removed before association.
        // hanging ideas are not allowed
        throw Error(
            `Association '${id}' cannot be removed ` +
            `because it has reference to tail idea`);
    }

    return model;
}

/**
 * Handles 'update mindmap' mutation
 * @param {object} model 
 * @param {object} mutation 
 * @return {object} model
 */
async function updateMindmap(model, mutation) {
    const {mindmap} = model;
    const patch = mutation.data;

    mapObject(mindmap, patch);

    return model;
}