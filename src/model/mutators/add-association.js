import required from 'utils/required-params';

import StateType from 'boot/client/State';

import AssociationType from 'model/entities/Association';

/**
 * Adds association
 * 
 * @param {StateType} state 
 * @param {object}          data
 * @param {AssociationType} data.assoc
 */
export default function addAssociation(state, data) {
    const {model: {mindset}} = state;
    const {assoc} = required(data);

    mindset.associations.set(assoc.id, assoc);
}