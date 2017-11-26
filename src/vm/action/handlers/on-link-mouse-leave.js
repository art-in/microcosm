import required from 'utils/required-params';
import view from 'vm/utils/view-patch';

/**
 * Handles link mouse leave event
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.linkId
 * @param {function} dispatch
 * @return {Patch}
 */
export default function onLinkMouseLeave(state, data, dispatch) {
    const {linkId} = required(data);

    return view('update-link', {
        id: linkId,
        highlighted: false,
        tooltip: {
            visible: false,
            viewportPos: null,
            value: null
        }
    });
}