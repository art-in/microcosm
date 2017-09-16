import mapObject from 'utils/map-object';

import * as ideaDB from 'data/db/ideas';
import * as assocDB from 'data/db/associations';
import * as mindmapDB from 'data/db/mindmaps';

import values from 'utils/get-map-values';

import calcDepths from 'utils/graph/calc-depths';
import buildGraph from 'model/utils/build-ideas-graph';

/**
 * Applies patch to model state
 * @param {object} state
 * @param {Patch} patch
 * @return {object} new state
 */
export default async function mutate(state, patch) {
    
    let newState = state;

    await Promise.all(patch.map(async function(mutation) {
        newState = await apply(newState, mutation);
    }));

    return newState;
}

/**
 * Applies single mutation to state
 * 
 * @param {object} state
 * @param {{type, data}} mutation
 * @return {object} new state
 */
async function apply(state, mutation) {

    let newState;

    switch (mutation.type) {

    case 'init':
        newState = await init(state, mutation);
        break;

    case 'add idea':
        newState = await addIdea(state, mutation);
        break;

    case 'update idea':
        newState = await updateIdea(state, mutation);
        break;

    case 'remove idea':
        newState = await removeIdea(state, mutation);
        break;

    case 'add association':
        newState = await addAssociation(state, mutation);
        break;

    case 'update association':
        newState = await updateAssociation(state, mutation);
        break;

    case 'remove association':
        newState = await removeAssociation(state, mutation);
        break;

    case 'update mindmap':
        newState = await updateMindmap(state, mutation);
        break;

    default:
        throw Error(`Unknown mutation '${mutation.type}'`);
    }

    return newState;
}

// TODO: split up mutators

/**
 * Handles 'init' mutation
 * @param {object} state 
 * @param {object} mutation 
 * @return {object} new state
 */
async function init(state, mutation) {
    const {model} = state;
    const {data} = mutation.data;
    
    // data
    const ideas = await ideaDB.getAll(data.ideas);
    const assocs = await assocDB.getAll(data.associations);
    const mindmaps = await mindmapDB.getAll(data.mindmaps);

    if (mindmaps.length === 0) {
        throw Error('Mindmap database is empty');
    }

    // TDB: get first mindmap
    const mindmap = mindmaps[0];

    mindmap.root = buildGraph(ideas, assocs);
    mindmap.root = calcDepths(mindmap.root);
    
    assocs.forEach(a => mindmap.associations.set(a.id, a));
    ideas.forEach(i => mindmap.ideas.set(i.id, i));

    model.mindmap = mindmap;

    return state;
}

/**
 * Handles 'add idea' mutation
 * @param {object} state 
 * @param {object} mutation 
 * @return {object} new state
 */
async function addIdea(state, mutation) {
    const {model} = state;
    const {mindmap} = model;
    const idea = mutation.data;

    mindmap.ideas.set(idea.id, idea);

    if (idea.isRoot) {

        // add root idea
        if (mindmap.root) {
            throw Error('Mindmap already has root idea');
        }

        mindmap.root = idea;

        // no incomming associations needed
        // for root idea
        idea.associationsIn = [];

        idea.depth = 0;

    } else {

        // bind with incoming associations
        const incomingAssocs = values(mindmap.associations)
            .filter(a => a.toId === idea.id);
    
        if (!incomingAssocs.length) {
            // incoming association should be added first.
            // hanging ideas are not allowed
            throw Error(
                `No incoming associations found for idea '${idea.id}'`);
        }

        incomingAssocs.forEach(a => a.to = idea);
        idea.associationsIn = incomingAssocs;

        // set depth (min parent depth + 1)
        const parents = incomingAssocs.map(assoc => assoc.from);
        const parentDepths = parents.map(parent => {
            if (parent.depth === undefined) {
                throw Error(`Parent idea '${parent.id}' does not have depth`);
            }

            return parent.depth;
        });

        idea.depth = Math.min(...parentDepths) + 1;
    }

    idea.associationsOut = [];

    return state;
}

/**
 * Handles 'update idea' mutation
 * @param {object} state 
 * @param {object} mutation 
 * @return {object} new state
 */
async function updateIdea(state, mutation) {
    const {model} = state;
    const {mindmap} = model;
    const patch = mutation.data;

    const idea = mindmap.ideas.get(patch.id);

    if (!idea) {
        throw Error(`Idea '${patch.id}' was not found`);
    }

    mapObject(idea, patch);
    return state;
}

/**
 * Handles 'remove idea' mutation
 * @param {object} state 
 * @param {object} mutation 
 * @return {object} new state
 */
async function removeIdea(state, mutation) {
    const {model} = state;
    const {mindmap} = model;
    const {id} = mutation.data;

    const idea = mindmap.ideas.get(id);

    // unbind from incoming associations
    if (!idea.isRoot &&
        (!idea.associationsIn || !idea.associationsIn.length)) {
        throw Error(`No incoming associations found for idea '${idea.id}'`);
    }

    idea.associationsIn.forEach(a => {
        a.toId = null;
        a.to = null;
    });
    idea.associationsIn = null;

    mindmap.ideas.delete(id);

    return state;
}

/**
 * Handles 'add association' mutation
 * @param {object} state 
 * @param {object} mutation 
 * @return {object} new state
 */
async function addAssociation(state, mutation) {
    const {model} = state;
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

    return state;
}

/**
 * Handles 'update association' mutation
 * @param {object} state 
 * @param {object} mutation 
 * @return {object} new state
 */
async function updateAssociation(state, mutation) {
    const {model} = state;
    const {mindmap} = model;
    const patch = mutation.data;

    const assoc = mindmap.associations.get(patch.id);

    if (!assoc) {
        throw Error(`Association '${patch.id}' was not found`);
    }

    mapObject(assoc, patch);
    
    return state;
}

/**
 * Handles 'remove association' mutation
 * @param {object} state 
 * @param {object} mutation 
 * @return {object} new state
 */
async function removeAssociation(state, mutation) {
    const {model} = state;
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

    return state;
}

/**
 * Handles 'update mindmap' mutation
 * @param {object} state 
 * @param {object} mutation 
 * @return {object} new state
 */
async function updateMindmap(state, mutation) {
    const {model} = state;
    const {mindmap} = model;
    const patch = mutation.data;

    mapObject(mindmap, patch);

    return state;
}