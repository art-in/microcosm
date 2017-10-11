import required from 'utils/required-params';

import calcDepths from 'utils/graph/calc-depths';
import buildGraph from 'model/utils/build-ideas-graph';

/**
 * Inits model state
 * 
 * @param {object}  state 
 * @param {object}  data 
 * @param {PouchDB} data.ideas
 * @param {PouchDB} data.associations
 * @param {PouchDB} data.mindmaps
 */
export default function init(state, data) {
    const {model} = state;
    const {entities} = required(data);
    const {ideas, associations, mindmaps} = required(entities);
    
    if (mindmaps.length === 0) {
        throw Error('Mindmap database is empty');
    }

    // TDB: get first mindmap
    const mindmap = mindmaps[0];

    mindmap.root = buildGraph(ideas, associations);
    mindmap.root = calcDepths(mindmap.root);
    
    associations.forEach(a => mindmap.associations.set(a.id, a));
    ideas.forEach(i => mindmap.ideas.set(i.id, i));

    model.mindmap = mindmap;
}