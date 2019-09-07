import update from 'utils/update-object';

import StateType from 'boot/client/State';

/**
 * Updates association
 *
 * @param {StateType} state
 * @param {object} data
 */
export default function updateAssociation(state, data) {
  const {model} = state;
  const {mindset} = model;
  const patch = data;

  const assoc = mindset.associations.get(patch.id);

  if (!assoc) {
    throw Error(`Association '${patch.id}' was not found`);
  }

  update(assoc, patch);
}
