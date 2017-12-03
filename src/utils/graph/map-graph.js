import WeightZone from 'utils/graph/WeightZone';
import isValidPathWeight from 'utils/graph/is-valid-path-weight';

import IVertexType from 'utils/graph/interfaces/IVertex';
import IEdgeType from 'utils/graph/interfaces/IEdge';

/**
 * Generic function for mapping graph of entities of one type
 * to graph of entities of another type
 * 
 * While mapping it is possible to slice particular portion of graph,
 * basing on how far target vertex is from root (root path weight).
 * 
 * From perspective of root path weight, all vertices fall into 3 groups
 * or weight zones:
 * 
 *     focus zone          (A)--->(B)<
 *                        / |      ^  \
 *   --------------------/--|------|---\--------
 *                      /   v      |    \ 
 *     shade zone      |   (C)--->(D)    \
 *                     |    #      ^      |
 *   ------------------|----#------#------|-----
 *                     v    v      #      |
 *     hide zone      (E)<#(#)###>(#)####>(F)
 * 
 * 
 *  # - vertices and edges that were ignored while mapping
 * 
 * Slicing uses following rules:
 * 
 * Vertices in focus zone can target ones in focus, shade or hide zones.
 * Vertices in shade zone can target ones in shade, focus, but not hide zone.
 * Vertices in hide zone can target ones in focus, but not hide or shade zones.
 * 
 * Main purposes of slicing are
 * - reduce amount of vertices by hiding too distant ones, while preserving all
 *   incoming and outgoing edges for vertices in focus zone.
 * - not slice rougly, but introduce intermediate 'shade' zone with 'relaxed'
 *   slicing rules
 * 
 * Note: mapping can produce graph with vertices unreachable from root.
 * it can happen for vertices located in hide zone, that target vertices
 * in focus zone (F-B edge on the scheme)
 * 
 * @param {object}   opts
 * @param {IVertexType} opts.vertex
 * @param {function} opts.mapVertex
 * @param {function} opts.mapEdge
 * @param {number}   [opts.focusZoneMax=infinity] - focus weight zone max
 * @param {number}   [opts.shadeZoneAmount=0]     - shade weight zone amount
 * @return {{rootVertex, vertices, edges}}
 */
export default function mapGraph(opts) {

    const vertices = [];
    const edges = [];

    const requiredOpts = {
        ...opts,
        focusZoneMax: opts.focusZoneMax || Infinity,
        shadeZoneAmount: opts.shadeZoneAmount || 0
    };

    const internalOpts = {
        visitedOriginalVertices: new Map(),
        allVertices: vertices,
        allEdges: edges
    };

    const rootVertex = mapGraphInternal(requiredOpts, internalOpts);

    return {
        rootVertex,
        vertices,
        edges
    };
}

/**
 * Internal map
 * @param {object}   opts
 * @param {object}   opts.vertex
 * @param {function} opts.mapVertex
 * @param {function} opts.mapEdge
 * @param {number}   opts.focusZoneMax
 * @param {number}   opts.shadeZoneAmount
 * 
 * @param {object} internalOpts
 * @param {Map}    internalOpts.visitedOriginalVertices 
 * @param {array}  internalOpts.allVertices 
 * @param {array}  internalOpts.allEdges
 * @return {{rootVertex, vertices, edges}}
 */
function mapGraphInternal(opts, internalOpts) {

    const {
        vertex: originalVertex,
        mapVertex,
        mapEdge,
        focusZoneMax,
        shadeZoneAmount
    } = opts;

    const {
        visitedOriginalVertices,
        allVertices,
        allEdges
    } = internalOpts;

    // check if vertex was already visited
    // to not fall into infinite loop in graph cycles
    let vertex = visitedOriginalVertices.get(originalVertex);
    if (vertex) {
        return vertex;
    }

    const vertexZone = getWeightZoneForVertex(
        originalVertex,
        focusZoneMax,
        shadeZoneAmount);

    // map vertex
    vertex = mapVertex(originalVertex, vertexZone);
    visitedOriginalVertices.set(originalVertex, vertex);

    allVertices.push(vertex);

    vertex.edgesIn = [];
    vertex.edgesOut = [];

    vertex.edgeFromParent = null;
    vertex.edgesToChilds = [];

    // map predecessor vertices.
    originalVertex.edgesIn.forEach(originalEdge => {

        const predecessorZone = getWeightZoneForVertex(
            originalEdge.from,
            focusZoneMax,
            shadeZoneAmount);

        if (!shouldFollowEdge(predecessorZone, vertexZone)) {
            return;
        }

        const edge = mapEdge(originalEdge, predecessorZone, vertexZone);

        edge.to = vertex;
        edge.from = mapGraphInternal({
            vertex: originalEdge.from,
            mapVertex,
            mapEdge,
            focusZoneMax,
            shadeZoneAmount
        }, {
            visitedOriginalVertices,
            allVertices,
            allEdges
        });

        // bind edge to head/tail vertices
        edge.from.edgesOut.push(edge);
        edge.to.edgesIn.push(edge);

        // bind edge to parent/child vertices
        if (originalEdge.to.edgeFromParent === originalEdge) {
            edge.to.edgeFromParent = edge;
            edge.from.edgesToChilds.push(edge);
        }

        allEdges.push(edge);
    });

    // map successor vertices.
    originalVertex.edgesOut.forEach(originalEdge => {
        const successorZone = getWeightZoneForVertex(
            originalEdge.to,
            focusZoneMax,
            shadeZoneAmount);

        if (!shouldFollowEdge(vertexZone, successorZone)) {
            return;
        }

        mapGraphInternal({
            vertex: originalEdge.to,
            mapVertex,
            mapEdge,
            focusZoneMax,
            shadeZoneAmount
        }, {
            visitedOriginalVertices,
            allVertices,
            allEdges
        });
    });

    return vertex;
}

/**
 * Gets weight zone for vertex
 * @param {IVertexType} vertex
 * @param {number} focusZoneMax
 * @param {number} shadeZoneAmount
 * @return {number} weight zone
 */
function getWeightZoneForVertex(vertex, focusZoneMax, shadeZoneAmount) {

    const {rootPathWeight} = vertex;

    // ensure root path weight set
    if (!isValidPathWeight(rootPathWeight)) {
        throw Error(`Invalid root path weight '${rootPathWeight}'`);
    }

    if (rootPathWeight <= focusZoneMax) {
        return WeightZone.focus;
    } else
    if (rootPathWeight <= focusZoneMax + shadeZoneAmount) {
        return WeightZone.shade;
    } else {
        return WeightZone.hide;
    }
}

/**
 * Decides whether mapper should follow edge while traversing original graph,
 * or ignore going farther and skip mapping that branch
 * @param {number} predecessorZone
 * @param {number} successorZone
 * @return {boolean}
*/
function shouldFollowEdge(predecessorZone, successorZone) {
    const {focus, shade, hide} = WeightZone;

    const from = predecessorZone;
    const to = successorZone;

    if (from === focus &&
       (to === focus || to === shade || to === hide)) {
        return true;
    }

    if (from === shade &&
       (to === shade || to === focus)) {
        return true;
    }

    if (from === hide && to === focus) {
        return true;
    }

    return false;
}