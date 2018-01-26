import getIdea from 'action/utils/get-idea';

import MindsetType from 'model/entities/Mindset';

import toListItem from 'vm/mappers/idea-to-list-item';
import getRootPath from 'action/utils/get-idea-root-path';
import IdeaSidebar from 'vm/list/entities/IdeaSidebar';

/**
 * Opens sidebar for new or existing idea
 *
 * @param {object} opts
 * @param {MindsetType} opts.mindset
 * @param {boolean} [opts.isNewIdea  = false] - is creating new idea
 * @param {string} [opts.parentIdeaId] - ID of parent idea if creating new idea
 * @param {string} [opts.ideaId] - ID of existing idea
 * @return {IdeaSidebar}
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

  const parentSuccessors = parent.edgesOut
    .map(a => a.to)
    .map(toListItem.bind(null, mindset));

  const sidebar = new IdeaSidebar({
    parentIdeaId: parent.id,
    title: parent.title,
    rootPath: getRootPath(mindset, parent.id),
    goParentAvailable: isNewIdea || ideaId !== mindset.root.id,
    successors: parentSuccessors
  });

  // TODO: highlight opened idea in successors list

  return sidebar;
}
