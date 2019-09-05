import clone from 'clone';

import StateType from 'boot/client/State';

/**
 * Clones state. Non-clonable props will be shallowly copied.
 *
 * Q: why mutate state here?
 * A: it is not mutated: state first mutated to ignore some props, then cloned,
 *    then restored back to original. this is least nasty approach I found so
 *    far to ignore certain object props while cloning. approach with
 *    destructuring assignment looks even worse.
 *
 * @param {StateType} state
 * @return {StateType} clone
 */
export default function cloneStateSafely(state) {
  // un-mount non-clonable props
  // File object
  let importFormFile;
  if (state.vm.main && state.vm.main.mindset) {
    importFormFile = state.vm.main.mindset.importFormModal.form.file;
    state.vm.main.mindset.importFormModal.form.file = null;
  }

  // HTMLElement object
  const viewRoot = state.view.root;
  state.view.root = null;

  // PouchDB databases (as they are bound to global state)
  const dataIdeas = state.data.ideas;
  const dataAssociations = state.data.associations;
  const dataMindsets = state.data.mindsets;

  state.data.ideas = null;
  state.data.associations = null;
  state.data.mindsets = null;

  // everything else can be safely cloned
  const stateClone = clone(state);

  // restore non-clonable props & shallow copy them to the clone
  if (state.vm.main && state.vm.main.mindset) {
    state.vm.main.mindset.importFormModal.form.file = importFormFile;
    stateClone.vm.main.mindset.importFormModal.form.file = importFormFile;
  }

  state.view.root = viewRoot;
  stateClone.view.root = viewRoot;

  state.data.ideas = dataIdeas;
  state.data.associations = dataAssociations;
  state.data.mindsets = dataMindsets;

  stateClone.data.ideas = dataIdeas;
  stateClone.data.associations = dataAssociations;
  stateClone.data.mindsets = dataMindsets;

  return stateClone;
}
