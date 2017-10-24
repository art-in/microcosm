import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

/**
 * Removes association
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.assocId
 * @param {function} dispatch
 * @return {Patch}
 */
export default function(state, data, dispatch) {
    const {assocId} = required(data);
    
    return new Patch({
        type: 'remove-association',
        data: {id: assocId}
    });
}