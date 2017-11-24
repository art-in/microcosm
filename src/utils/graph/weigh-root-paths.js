import calcRootPaths from 'utils/graph/calc-root-paths';

/**
 * Calculates minimal root paths (MRP) for each vertex in the graph
 * and stores results in graph entities
 * 
 * @param {object} opts
 */
export default function weighRootPaths(opts) {
    const weightsData = calcRootPaths(opts);

    weightsData.forEach(data => {
        const vertex = data.vertex;
        
        vertex.rootPathWeight = data.rootPathWeight;
        vertex.edgeFromParent = data.edgeFromParent;
        vertex.edgesToChilds = data.edgesToChilds;
    });
}