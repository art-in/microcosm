import assert from 'assert';

import Patch from 'utils/state/Patch';

/**
 * Shows color picker
 * 
 * @param {object} data
 * @param {string} data.ideaId - ID of target idea
 * @return {Patch}
 */
export default function showColorPickerForIdea(
    {ideaId}) {

    assert(ideaId !== undefined);

    return new Patch([{
        type: 'show-color-picker',
        data: {
            onSelectAction: ({color}) => ({
                type: 'set-idea-color',
                data: {
                    ideaId,
                    color
                }
            })
        },
        targets: ['vm', 'view']
    }]);
}