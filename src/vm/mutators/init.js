import required from 'utils/required-params';

/**
 * Applies 'init' mutation
 * @param {object} state
 * @param {object} data
 */
export default function init(state, data) {
    const {vm: {main}} = required(data);

    state.vm.main = main;
}