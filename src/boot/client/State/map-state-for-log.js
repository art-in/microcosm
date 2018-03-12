import clone from 'clone';

import StateType from 'boot/client/State';

const IGNORED_TAG = '<ignored to log>';

/**
 * Gets part of app state that should be logged.
 *
 * Q: why not just log entire state?
 * A: (1) not everything is human readable (eg. databases), and can be ignored,
 *    (2) not everything is clonnable (eg. HTML elements), and must be ignored,
 *        otherwise clonning will fail.
 *
 * Q: why clone state?
 * A: browser console logs objects in lazy manner. ie. only resolving them
 *    when they are actually expanded by user. at that moment state can be
 *    already changed. cloning preserves state at certain moment.
 *
 * Q: why mutate state here?
 * A: this is least nasty approach I fould so far to ignore certain object props
 *    while cloning. state first mutated to ignore some props, then clonned,
 *    then restored back to original.
 *    extracting necessary props through destructuring looks even worse.
 *
 * @param {StateType} state
 * @return {object}
 */
export default function mapStateForLog(state) {
  // ignore databases since they are not human readable
  const dataIdeas = state.data.ideas;
  // @ts-ignore allow to assign wrong type
  state.data.ideas = IGNORED_TAG;

  const dataAssociations = state.data.associations;
  // @ts-ignore allow to assign wrong type
  state.data.associations = IGNORED_TAG;

  const dataMindsets = state.data.mindsets;
  // @ts-ignore allow to assign wrong type
  state.data.mindsets = IGNORED_TAG;

  // ignore File object since it is not clonable
  let importFormFile;
  if (state.vm.main && state.vm.main.mindset) {
    importFormFile = state.vm.main.mindset.importFormModal.form.file;
    // @ts-ignore allow to assign wrong type
    state.vm.main.mindset.importFormModal.form.file = IGNORED_TAG;
  }

  // ignore view root since HTML element is not clonable
  const viewRoot = state.view.root;
  // @ts-ignore allow to assign wrong type
  state.view.root = IGNORED_TAG;

  const stateClone = clone(state);

  // restore
  state.data.ideas = dataIdeas;
  state.data.associations = dataAssociations;
  state.data.mindsets = dataMindsets;

  if (state.vm.main && state.vm.main.mindset) {
    state.vm.main.mindset.importFormModal.form.file = importFormFile;
  }

  state.view.root = viewRoot;

  return stateClone;
}
