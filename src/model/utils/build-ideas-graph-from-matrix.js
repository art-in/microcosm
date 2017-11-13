import Idea from 'model/entities/Idea';
import Association from 'model/entities/Association';

import buildGraphFromMatrix from 'utils/graph/build-graph-from-matrix';
import weighRootPaths from 'utils/graph/weigh-root-paths';

/**
 * Builds ideas graph from adjacency matrix
 * 
 * Only for unit tests.
 * 
 * Not used in prod because matrix is less efficient than adjacency list.
 * But building arbitrary graph in unit tests from matrix is much briefer.
 * 
 * 
 * Q: why is it in src/ folder and not in test/ like other test utils?
 * A: this util has unit test, and I did not found good place for tests
 *    of test utils yet. but basicly yes, this should be in test/utils/ folder.
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