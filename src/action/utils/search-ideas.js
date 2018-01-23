import values from "utils/get-map-values";

import IdeaType from "model/entities/Idea";
import MindsetType from "model/entities/Mindset";

/**
 * Searches ideas
 *
 * @param {MindsetType} mindset
 * @param {object} opts
 * @param {string} opts.phrase
 * @param {Object.<string>} [opts.excludeIds]
 * @return {Array.<IdeaType>}
 */
export default function searchIdeas(mindset, opts) {
  const { phrase, excludeIds } = opts;

  if (!phrase) {
    throw Error("Search string is empty");
  }

  return values(mindset.ideas).filter(idea => {
    if (excludeIds && excludeIds.includes(idea.id)) {
      return false;
    }

    const regexp = new RegExp(phrase, "i");

    return (
      (idea.title && idea.title.match(regexp)) ||
      (idea.value && idea.value.match(regexp))
    );
  });
}
