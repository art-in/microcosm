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

  const byTitle = [];
  const byValue = [];

  // using regexp to easily ignore case
  const regexp = new RegExp(escapeRegExp(phrase), 'i');

  values(mindset.ideas).forEach(idea => {
    if (excludeIds && excludeIds.includes(idea.id)) {
      return;
    }

    if (idea.title && idea.title.match(regexp)) {
      byTitle.push(idea);
    } else if (idea.value && idea.value.match(regexp)) {
      byValue.push(idea);
    }
  });

  return byTitle.concat(byValue);
}
