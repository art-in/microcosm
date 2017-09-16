import buildGraph from 'utils/graph/build-graph';

/**
 * Constructs graph structure from ideas and associations
 * 
 * After extracting from storage, domain models only has IDs
 * of related entities.
 * In graph each model has direct link to related entity model,
 * eg. associations obtain references to corresponding from/to ideas
 * 
 * Build graph is much performant for graph algorithms,
 * since you do not have to search entity lists each time when traversing graph
 * 
 * @param {array.<Idea>} ideas
 * @param {array.<Association>} associations
 * @return {Idea} root idea
 */
export default function(ideas, associations) {
    return buildGraph(
        ideas,
        associations,
        'idea',
        'association',
        idea => idea.isRoot
    );
}