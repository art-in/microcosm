import required from 'utils/required-params';
import view from 'vm/utils/view-patch';

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

    return view('update-color-picker', {active: false});
}