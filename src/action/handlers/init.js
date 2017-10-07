import Patch from 'utils/state/Patch';

/**
 * Inits state
 * 
 * @param {object} state
 * @param {object} data
 * @return {Patch}
 */
export default function init(state, data) {
    return new Patch({type: 'init', data});
}