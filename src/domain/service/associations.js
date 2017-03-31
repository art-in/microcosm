import Patch from 'state/Patch';

import Dispatcher from 'state/Dispatcher';

const disp = new Dispatcher();

disp.reg('set-association-value',
async ({assocId, value}, {mindmap}) => {

    const idea = getAssociation(mindmap, assocId);

    if (idea.value != value) {
        return new Patch('update association', {id: assocId, value});
    }

});

/**
 * Gets association by ID
 *
 * @param {Mindmap} mindmap
 * @param {string} assocId
 * @return {Association}
 */
function getAssociation(mindmap, assocId) {

    const assoc = mindmap.assocs.find(a => a.id === assocId);

    if (!assoc) {
        throw Error(`Association with ID '${assocId}' not found in mindmap`);
    }

    return assoc;
}

export default disp;