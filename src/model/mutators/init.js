import * as ideaDB from 'data/db/ideas';
import * as assocDB from 'data/db/associations';
import * as mindmapDB from 'data/db/mindmaps';

import calcDepths from 'utils/graph/calc-depths';
import buildGraph from 'model/utils/build-ideas-graph';

/**
 * Handles 'init' mutation
 * @param {object} state 
 * @param {object} mutation 
 * @return {object} new state
 */
export default async function init(state, mutation) {
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