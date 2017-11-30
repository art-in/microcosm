import required from 'utils/required-params';

import StateType from 'boot/client/State';

/**
 * Applies 'init' mutation
 * @param {StateType} state
 * @param {object} data
 */
export default function init(state, data) {
    const {vm: {main}} = required(data);

    state.vm.main = main;
}