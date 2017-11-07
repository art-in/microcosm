import required from 'utils/required-params';

const charCodeA = 65;
const charCount = 26;

/**
 * Generic function for building object graph from adjacency matrix
 * 
 * Q: Why input matrix is array of strings and not array of number arrays?
 * A: Because it is possible to align columns without violating lint rules.
 * 
 * @param {object}         opts
 * @param {array.<string>} opts.matrix
 * @param {function}       opts.NodeConstructor
 * @param {function}       opts.LinkConstructor
 * @return {object} root node
 */
export default function buildGraphFromMatrix(opts) {
    const {matrix: m, NodeConstructor, LinkConstructor} = required(opts);

    // validate input
    if (!Array.isArray(m) ||
        !m.every(l => typeof l === 'string')) {
        throw Error('Invalid matrix. Expecting array of strings');
    }

    const nodesCount = m.length;

    if (nodesCount > charCount) {
        throw Error(`Invalid matrix. Too much nodes (>${charCount})`);
    }

    // create nodes (A, B, C, etc.)
    const nodes = [];
    for (let i = 0; i < nodesCount; i++) {
        const id = String.fromCharCode(charCodeA + i);
        const node = new NodeConstructor({id});
        node.linksIn = [];
        node.linksOut = [];
        nodes.push(node);
    }

    // parse and validate matrix
    // @type {array.<array<number>>}
    const matrix = [];

    m.forEach((line, headNodeIdx) => {

        const headId = nodes[headNodeIdx].id;

        // parse weights of outgoing links
        const linkWeights = line
            .split(' ')
            .filter(s => s !== '')
            .map(linkWeightStr => {
                const linkWeight = Number(linkWeightStr);
                if (!Number.isFinite(linkWeight) || linkWeight < 0) {
                    throw Error(
                        `Invalid outgoing link weight '${linkWeightStr}' ` +
                        `for node '${headId}'`);
                }
                return linkWeight;
            });

        if (linkWeights.length !== nodesCount) {
            throw Error(
                `Invalid matrix. Wrong number of columns for node '${headId}'`);
        }

        if (linkWeights[headNodeIdx] !== 0) {
            throw Error(
                `Self loops are not allowed. Main diagonal should be zero ` +
                `for node '${headId}'`);
        }

        if (linkWeights[0] > 0) {
            throw Error(
                `Link towards root is not allowed for node '${headId}'`);
        }

        matrix.push(linkWeights);

        linkWeights.forEach((w, tailNodeIdx) => {
            if (matrix[headNodeIdx] !== undefined &&
                matrix[tailNodeIdx] !== undefined &&
                matrix[headNodeIdx][tailNodeIdx] > 0 &&
                matrix[tailNodeIdx][headNodeIdx] > 0) {
                throw Error(
                    `Mutual links are not allowed between nodes ` +
                    `'${headId}' and '${nodes[tailNodeIdx].id}'`);
            }
        });
    });

    // bind nodes and links
    const links = [];
    matrix.forEach((linkWeights, headNodeIdx) => {

        linkWeights.forEach((linkWeight, tailNodeIdx) => {

            if (linkWeight === 0) {
                // no link
                return;
            }

            const head = nodes[headNodeIdx];
            const tail = nodes[tailNodeIdx];

            const link = new LinkConstructor({
                id: `${head.id} to ${tail.id}`,

                fromId: head.id,
                from: head,
                toId: tail.id,
                to: tail,

                weight: linkWeight
            });

            head.linksOut.push(link);
            tail.linksIn.push(link);

            links.push(link);
        });
    });

    // node 'A' is always root
    const root = nodes[0];
    root.isRoot = true;

    return {root, nodes, links};
}