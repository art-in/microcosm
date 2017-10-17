import required from 'utils/required-params';
import view from 'vm/utils/view-patch';

/**
 * Shows color picker
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.ideaId - ID of target idea
 * @return {Patch}
 */
export default function showColorPickerForIdea(state, data) {
    const {ideaId} = required(data);

    return view('update-color-picker', {
        
        active: true,
        onSelectAction: ({color}) => ({
            type: 'on-idea-color-selected',
            data: {
                ideaId,
                color
            }
        })
    });
}