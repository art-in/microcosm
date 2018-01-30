import StateType from 'boot/client/State';
import ViewMode from 'vm/main/MindsetViewMode';

/**
 * Handles click event from go root button
 *
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
  const {model: {mindset: {root}}} = state;
  const {vm: {main: {mindset: mindsetVM}}} = state;

  switch (mindsetVM.mode) {
    case ViewMode.mindmap:
      dispatch({
        type: 'animate-mindmap-viewbox-to-idea',
        data: {ideaId: root.id}
      });
      break;

    case ViewMode.zen:
      dispatch({
        type: 'zen-open-idea',
        data: {ideaId: root.id}
      });
      break;

    default:
      throw Error(`Unknown mindset view mode '${mindsetVM.mode}'`);
  }
}
