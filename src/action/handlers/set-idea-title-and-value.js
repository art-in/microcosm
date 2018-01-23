import required from "utils/required-params";
import Patch from "utils/state/Patch";

import StateType from "boot/client/State";

import getIdea from "action/utils/get-idea";
import isValidIdeaTitle from "action/utils/is-valid-idea-title";

/**
 * Sets title and value to existing idea
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.ideaId
 * @param {string} data.title
 * @param {string} data.value
 * @return {Patch|undefined}
 */
export default function setIdeaTitleAndValue(state, data) {
  const { model: { mindset } } = state;
  const { ideaId, title, value } = required(data);

  const idea = getIdea(mindset, ideaId);

  if (idea.title === title && idea.value === value) {
    // was not changed
    return;
  }

  if (!isValidIdeaTitle(title)) {
    throw Error(`Invalid idea title '${title}'`);
  }

  return new Patch("update-idea", {
    id: ideaId,
    title: title.trim(),
    value
  });
}
