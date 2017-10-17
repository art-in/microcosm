import required from 'utils/required-params';
import view from 'vm/utils/view-patch';

/**
 * Handles suggestion select event of association tails lookup
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.headIdeaId
 * @param {string} data.tailIdeaId
 * @param {function} dispatch
 * @return {Patch}
 */
export default function(state, data, dispatch) {
    const {headIdeaId, tailIdeaId} = required(data);
    
    dispatch({
        type: 'create-cross-association',
        data: {
            headIdeaId,
            tailIdeaId
        }
    });

    return view('update-association-tails-lookup', {
        popup: {active: false}
    });
}