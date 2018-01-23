import getIdea from './get-idea';
import searchIdeas from './search-ideas';

import IdeaType from 'model/entities/Idea';
import MindsetType from 'model/entities/Mindset';

/**
 * Searches ideas that potentially can be successors for target idea
 *
 * @param {MindsetType} mindset
 * @param {object} opts
 * @param {string} opts.ideaId
 * @param {string} opts.phrase
 * @return {Array.<IdeaType>}
 */
export default function searchSuccessors(mindset, opts) {
  const {ideaId, phrase} = opts;

  const headIdea = getIdea(mindset, ideaId);

  const excludeIds = [];

  // exclude head
  excludeIds.push(ideaId);

  // exclude successors
  const successorIds = headIdea.edgesOut.map(a => a.to.id);
  excludeIds.push(...successorIds);

  // exclude predecessors
  const predecessorIds = headIdea.edgesIn.map(a => a.from.id);
  excludeIds.push(...predecessorIds);

  // exclude root idea
  excludeIds.push(mindset.root.id);

  return searchIdeas(mindset, {phrase, excludeIds});
}
