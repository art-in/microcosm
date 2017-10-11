import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

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

    return new Patch({
        type: 'show-color-picker',
        data: {
            onSelectAction: ({color}) => ({
                type: 'on-idea-color-selected',
                data: {
                    ideaId,
                    color
                }
            })
        },
        targets: ['vm', 'view']
    });
}