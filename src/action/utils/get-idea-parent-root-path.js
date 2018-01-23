import MindsetType from 'model/entities/Mindset';
import AssociationType from 'model/entities/Association';

import getIdea from './get-idea';
import getIdeaRootPath from 'action/utils/get-idea-root-path';

/**
 * Gets path from root to parent of target idea in string form
 *
 * @example
 * getIdeaParentRootPath(mindset, 'football id') // '/root/sports'
 *
 * @param {MindsetType} mindset
 * @param {string} ideaId
 * @return {string}
 */
export default function getIdeaParentRootPath(mindset, ideaId) {
  if (mindset.root.id === ideaId) {
    return '/';
  }

  const idea = getIdea(mindset, ideaId);
  return getIdeaRootPath(mindset, idea.edgeFromParent.from.id);
}
