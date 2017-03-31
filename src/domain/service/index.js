import ideas from './ideas';
import associations from './associations';
import mindmaps from './mindmaps';

import Patch from 'state/Patch';
import Dispatcher from 'state/Dispatcher';

const disp = Dispatcher.combine(ideas, associations, mindmaps);

disp.reg('init', data => new Patch('init', data));

/**
 * Dispatches action
 *
 * @param {string} type - action type
 * @param {*} data - action data
 * @param {object} state - model state
 * @return {Patch} state patch
 */
export default async function(type, data, state) {
    const patches = await disp.dispatch(type, data, state);
    return Patch.combine(...patches);
}