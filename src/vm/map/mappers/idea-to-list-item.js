import IdeaType from 'model/entities/Idea';
import MindsetType from 'model/entities/Mindset';

import IdeaListItem from 'vm/shared/IdeaListItem';
import getRootPathForParent from 'action/utils/get-idea-parent-root-path';
import getRootPath from 'action/utils/get-idea-root-path';
import getIdeaColor from 'action/utils/get-idea-color';

/**
 * Maps idea model to list item view model
 *
 * @param {MindsetType} mindset
 * @param {IdeaType} idea
 * @return {IdeaListItem}
 */
export default function ideaToListItem(mindset, idea) {
  return new IdeaListItem({
    id: idea.id,
    title: idea.title,
    color: getIdeaColor(mindset, idea.id),
    tooltip: getRootPath(mindset, idea.id),
    rootPath: getRootPathForParent(mindset, idea.id)
  });
}
