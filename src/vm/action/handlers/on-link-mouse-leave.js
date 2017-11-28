import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

/**
 * Handles link mouse leave event
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.linkId
 * @return {PatchType}
 */
export default function onLinkMouseLeave(state, data) {
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