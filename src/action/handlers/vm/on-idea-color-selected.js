import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

/**
 * Handles idea color selected with color picker
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.ideaId
 * @param {string} data.color
 * @param {function} dispatch
 * @return {Patch}
*/
export default function onIdeaColorSelected(state, data, dispatch) {
    const {ideaId, color} = required(data);

    dispatch({
        type: 'set-idea-color',
        data: {ideaId, color}
    });

    return new Patch({
        type: 'hide-color-picker',
        targets: ['vm', 'view']
    });
}