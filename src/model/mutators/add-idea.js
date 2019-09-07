import required from 'utils/required-params';

import StateType from 'boot/client/State';

import IdeaType from 'model/entities/Idea';

/**
 * Adds idea
 *
 * @param {StateType} state
 * @param {object}   data
 * @param {IdeaType} data.idea
 */
export default function addIdea(state, data) {
  const {model} = state;
  const {mindset} = model;
  const {idea} = required(data);

  mindset.ideas.set(idea.id, idea);
}
