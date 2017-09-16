import Patch from 'utils/state/Patch';

import Dispatcher from 'utils/state/Dispatcher';

const disp = new Dispatcher();

/**
 * Sets mindmap position
 * 
 * @param {object} data
 * @param {string} data.mindmapId
 * @param {Point} data.pos - new position of viewbox on canvas
 * @return {Patch}
 */
disp.reg('set-mindmap-position',
    async ({mindmapId, pos}, {model: {mindmap}}) => {

        if (mindmap.id !== mindmapId) {
            throw Error('Setting position of not loaded mindmap');
        }

        return new Patch('update mindmap', {
            id: mindmapId,
            x: pos.x,
            y: pos.y
        });
    });

/**
 * Sets mindmap scale
 * 
 * @param {object} data
 * @param {string} data.mindmapId
 * @param {number} data.scale - target scale
 * @param {Point} data.pos - new position of viewbox on canvas
 * @return {Patch}
 */
disp.reg('set-mindmap-scale',
    async ({mindmapId, scale, pos}, {model: {mindmap}}) => {

        if (mindmap.id !== mindmapId) {
            throw Error('Setting scale of not loaded mindmap');
        }

        return new Patch('update mindmap', {
            id: mindmapId,
            scale,
            x: pos.x,
            y: pos.y
        });
    });

export default disp;