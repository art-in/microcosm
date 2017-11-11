import Idea from 'model/entities/Idea';
import Association from 'model/entities/Association';

import buildGraphFromMatrix from 'utils/graph/build-graph-from-matrix';
import weighRootPaths from 'utils/graph/weigh-root-paths';

/**
 * Builds ideas graph from adjacency matrix
 * 
 * Only for unit tests.
 * 
 * Q: link list vs adjacency matrix
 * A: link list
 * - matrix consumes more DB memory then links list,
 * - code serving matrix is less performant (direct refs are always better),
 * - code serving matrix going to be less readable (I guess).
 * 
 * But building arbitrary graph in unit tests from matrix is much briefer.
 * 
 * @param {array.<string>} matrix
 * @return {Idea} root node
*/
export default function buildIdeasGraphFromMatrix(matrix) {
    const {root, nodes, links} = buildGraphFromMatrix({
        matrix,
        NodeConstructor: Idea,
        LinkConstructor: Association
    });

    weighRootPaths({root});

    return {root, nodes, links};
}