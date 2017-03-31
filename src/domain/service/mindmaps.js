import Patch from 'state/Patch';

import Dispatcher from 'state/Dispatcher';

const disp = new Dispatcher();

disp.reg('set-mindmap-position',
async ({mindmapId, pos}, {mindmap}) => {

    if (mindmap.id !== mindmapId) {
        throw Error('Setting position of not loaded mindmap');
    }

    return new Patch('update mindmap', {
        id: mindmapId,
        x: pos.x,
        y: pos.y
    });
});

disp.reg('set-mindmap-scale',
async ({mindmapId, scale}, {mindmap}) => {

    if (mindmap.id !== mindmapId) {
        throw Error('Setting scale of not loaded mindmap');
    }

    return new Patch('update mindmap', {
        id: mindmapId,
        scale
    });
});

export default disp;