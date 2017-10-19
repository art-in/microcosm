/**
 * Calculates focus depth for graph
 * 
 * Focus depth - is depth of nodes, which resulting size 
 * is close to original for current viewbox scale.
 * 
 * Resulting size is close to original when its resulting scale ~ 1.
 * Resulting node scale = viewbox scale * node scale.
 * 
 * Node can be downscaled because of its depth in graph.
 * Same time viewport can be upscaled, so resulting size 
 * of rendered node goes back to original.
 * 
 * Ie. nodes of what depth will look not resized with this scale
 * 
 * Note 1: result should be balanced with node depth downscaling logic.
 * Otherwise eg. if nodes will be downscaled faster than
 * focused graph depth, while zooming, graph will focus
 * smaller and smaller nodes until they cannot be seen.
 * 
 * Calculus: 
 * Sn  - Scale of node
 * Sn* - Resulting scale of node
 * Dn  - Depth of node
 * Sv  - Scale of viewport
 * 
 * Sn = 1 / (Dn + 1)
 * Sv = Dn + 1
 * Dn = Sv - 1
 * Sn* = Sn * Sv = (1 / (Dn + 1)) * (Dn + 1) = 1
 * 
 * So if we want Sn* be equal to 1 (original size),
 * we need to keep (Sn * Sv) equal to 1
 * @see {@link get-node-scale-for-depth}
 * 
 * Node 2: balancing focus depth can be implemented imperatively,
 * ie. by traversing nodes graph and finding depth of nodes
 * with resulting scale closest to 1.
 * But algorithmical approach will always be faster
 * (harder to read though).
 * 
 * @param {number} viewboxScale 
 * @return {number} node depth
 */
export default function getGraphFocusDepth(viewboxScale) {
    const depth = Math.round(viewboxScale - 1);

    // depth cannot be negative
    return Math.max(depth, 0);
}