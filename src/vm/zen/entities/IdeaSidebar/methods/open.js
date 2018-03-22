import SortDirection from 'utils/sort/sort-direction';
import byCreatedOn from 'utils/sort/get-comparator-by-created-on';
import getIdea from 'action/utils/get-idea';
import getRootPath from 'action/utils/get-idea-root-path';

import MindsetType from 'model/entities/Mindset';

import toListItem from 'vm/mappers/idea-to-list-item';
import IdeaSidebarType from 'vm/zen/entities/IdeaSidebar';
import IdeaListItemType from 'vm/shared/IdeaListItem';

/**
 * Opens sidebar for new or existing idea
 *
 * @param {object} opts
 * @param {MindsetType} opts.mindset
 * @param {boolean} [opts.isNewIdea  = false] - is creating new idea
 * @param {string} [opts.parentIdeaId] - ID of parent idea if creating new idea
 * @param {string} [opts.ideaId] - ID of existing idea
 * @return {Partial.<IdeaSidebarType>}
 */
export default function open(opts) {
  const {mindset, isNewIdea = false, parentIdeaId, ideaId} = opts;

  if (isNewIdea && parentIdeaId === undefined) {
    throw Error('Not received ID of parent idea');
  }

  if (!isNewIdea && ideaId === undefined) {
    throw Error('Not received ID of existing idea');
  }

  let parent;

  if (isNewIdea) {
    parent = getIdea(mindset, parentIdeaId);
  } else {
    const idea = getIdea(mindset, ideaId);
    if (idea === mindset.root) {
      parent = idea;
    } else {
      parent = idea.edgeFromParent.from;
    }
  }

  /** @type {Array.<IdeaListItemType>} */
  const parentSuccessors = parent.edgesOut
    .sort(byCreatedOn(SortDirection.desc))
    .map(a => a.to)
    .map(toListItem.bind(null, mindset));

  // highlight opened idea in successors list
  if (!isNewIdea && ideaId !== mindset.root.id) {
    parentSuccessors.find(i => i.id === ideaId).isHighlighted = true;
  }

  return {
    parentIdeaId: parent.id,
    title: parent.title,
    rootPath: getRootPath(mindset, parent.id),
    goParentAvailable: isNewIdea || ideaId !== mindset.root.id,
    successors: parentSuccessors
  };
}
