import required from "utils/required-params";
import StateType from "boot/client/State";

/**
 * Inits view model state
 *
 * @param {StateType} state
 * @param {object} data
 */
export default function init(state, data) {
  const { vm } = state;
  const { main } = required(data.vm);

  vm.main = main;
}
