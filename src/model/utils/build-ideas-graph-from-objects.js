import buildGraphFromObjects from 'utils/graph/build-graph-from-objects';

/**
 * Builds object graph from ideas and associations objects
 * 
 * After extracting from storage, domain models only has IDs
 * of related entities.
 * In object graph each model has direct link to related entity model,
 * eg. associations obtain references to corresponding from/to ideas
 * 
 * Object graph is much performant for graph algorithms,
 * since you do not have to search entity lists each time when traversing graph
 * 
 * TODO: rename to build-ideas-graph-from-list (adj matrix vs adj list)
 * 
 * @param {array.<Idea>} ideas
 * @param {array.<Association>} associations
 * @return {Idea} root idea
 */
export default function(ideas, associations) {
    return buildGraphFromObjects({
        nodes: ideas,
        links: associations,
        isRootNode: idea => idea.isRoot
    });
}