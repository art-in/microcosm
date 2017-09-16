import Patch from 'utils/state/Patch';

/**
 * Inits state
 * @param {object} data
 * @return {Patch}
 */
export default function init(data) {
    return new Patch('init', data);
}