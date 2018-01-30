import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

import onTitleChange from 'vm/shared/IdeaForm/methods/on-title-change';

/**
 * Handles change event from title field of zen idea form
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.title
 * @return {PatchType}
 */
export default function(state, data) {
  const {vm: {main: {mindset: {zen}}}} = state;
  const {title} = required(data);

  const {form} = zen.pane;

  return view('update-zen-idea-pane', {
    form: onTitleChange(form, title)
  });
}
