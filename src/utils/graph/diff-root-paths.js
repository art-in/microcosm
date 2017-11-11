import calcRootPaths from 'utils/graph/calc-root-paths';

/**
 * Calculates minimal root paths (MRP) and diffs result with current graph state
 * 
 * Q: this function produces MRP object for each node in the graph while
 *    calculating root paths.
 *    lots of objects will be produced for big graphs, which will hurt GC.
 *    most of them usually will be skipped since MRP equals to node state.
 *    is it possible to only produce MRP object when root path is really
 *    different (ie. diff-ing during root paths calc process)?
 * A: im affraid no (or I dont know that solution for now).
 *    calc uses Dijkstra algorithm which can visit same node several times 
 *    during search for the best path among all possible. so it needs to
 *    preserve previous best path info somewhere anyway. it is hard to
 *    predict whether final best path will equal to node state or not.
 *    so currently diff-ing after full calc.
 * 
 * @param {object} opts
 * @return {array} MRP data for nodes
*/
export default function diffRootPaths(opts) {

    const mrpData = calcRootPaths(opts);

    const diffs = [];

    // find difference between calculated MRP and current MRP state of nodes
    mrpData.forEach(data => {

        const node = data.node;

        const diff = {};
        let isDifferent = false;

        if (node.rootPathWeight !== data.rootPathWeight) {
            isDifferent = true;
            diff.rootPathWeight = data.rootPathWeight;
        }

        if (node.linkFromParent !== data.linkFromParent) {
            isDifferent = true;
            diff.linkFromParent = data.linkFromParent;
        }

        if (node.linksToChilds.length !== data.linksToChilds.length ||
            node.linksToChilds.some(l => !data.linksToChilds.includes(l))) {
            
            isDifferent = true;
            diff.linksToChilds = data.linksToChilds;
        }

        if (isDifferent) {
            diff.node = node;
            diffs.push(diff);
        }
    });

    return diffs;
}