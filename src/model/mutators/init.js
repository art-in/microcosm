import required from 'utils/required-params';

import buildGraph from 'model/utils/build-ideas-graph-from-objects';
import weighRootPaths from 'utils/graph/weigh-root-paths';

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

    // init graph
    mindmap.root = buildGraph(ideas, associations);
    weighRootPaths(mindmap.root);

    // init maps
    associations.forEach(a => mindmap.associations.set(a.id, a));
    ideas.forEach(i => mindmap.ideas.set(i.id, i));

    model.mindmap = mindmap;
}