import values from 'utils/get-map-values';
import escapeRegExp from 'utils/escape-regexp';

import IdeaType from 'model/entities/Idea';
import MindsetType from 'model/entities/Mindset';

/**
 * Searches ideas
 *
 * @param {MindsetType} mindset
 * @param {object} opts
 * @param {string} opts.phrase
 * @param {Array.<string>} [opts.excludeIds]
 * @return {Array.<IdeaType>}
 */
export default function searchIdeas(mindset, opts) {
  const {phrase, excludeIds} = opts;

  if (!phrase) {
    throw Error('Search string is empty');
  }

  const regexp = new RegExp(escapeRegExp(phrase), 'i');

  return values(mindset.ideas).filter(idea => {
    if (excludeIds && excludeIds.includes(idea.id)) {
      return false;
    }

    return (
      (idea.title && idea.title.match(regexp)) ||
      (idea.value && idea.value.match(regexp))
    );
  });
}
