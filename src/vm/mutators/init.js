import required from 'utils/required-params';

import StateType from 'boot/client/State';
import MainVmType from 'vm/main/Main';

/**
 * Applies 'init' mutation
 * @param {StateType} state
 * @param {object} data
 * @param {object} data.vm
 * @param {MainVmType} data.vm.main
 */
export default function init(state, data) {
    const {vm: {main}} = required(data);

    state.vm.main = main;
}