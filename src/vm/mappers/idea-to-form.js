import SortDirection from 'utils/sort/sort-direction';
import byCreatedOn from 'utils/sort/get-comparator-by-created-on';
import moveItem from 'utils/move-array-item';
import getRootPathVertices from 'utils/graph/get-root-path-vertices';

import MindsetType from 'model/entities/Mindset';
import IdeaType from 'model/entities/Idea';

import IdeaForm from 'vm/shared/IdeaForm/IdeaForm';
import toListItem from 'vm/mappers/idea-to-list-item';
import IdeaListItem from 'vm/shared/IdeaListItem';

/**
 * Maps idea model to form view model
 *
 * @param {MindsetType} mindset
 * @param {IdeaType} idea
 * @return {IdeaForm}
 */
export default function ideaToForm(mindset, idea) {
  const form = new IdeaForm();

  // map basics
  form.ideaId = idea.id;
  form.parentIdeaId = null;
  form.isNewIdea = false;

  form.title = idea.title || '';
  form.value = idea.value || '';
  form.color = idea.color || '';

  // prevent removing idea with outgoing associations
  form.isRemoveAvailable = idea !== mindset.root && idea.edgesOut.length === 0;
  form.isTitleValid = true;
  form.shouldFocusTitleOnShow = false;
  form.isEditingValue = false;
  form.isGearMenuAvailable = true;
  form.isGearMenuExpanded = false;
  form.isSuccessorsEditable = true;
  form.isSaveable = false;
  form.isCancelable = false;

  // map root path
  if (idea !== mindset.root) {
    const parent = idea.edgeFromParent.from;

    const rootPathIdeas = getRootPathVertices(mindset.root, parent);
    form.rootPath = rootPathIdeas.map(
      idea =>
        new IdeaListItem({
          id: idea.id,
          title: idea.title,
          tooltip: idea.title
        })
    );
  } else {
    form.rootPath = [];
  }

  // map predecessors
  if (mindset.root !== idea) {
    let incomingAssocs = idea.edgesIn.sort(byCreatedOn(SortDirection.asc));

    // move parent to the top of predecessors
    const parentAssocIdx = incomingAssocs.indexOf(idea.edgeFromParent);
    incomingAssocs = moveItem(incomingAssocs, parentAssocIdx, 0);

    form.predecessors = incomingAssocs
      .map(a => a.from)
      .map(toListItem.bind(null, mindset));
  } else {
    form.predecessors = [];
  }

  // map successors
  form.successors = idea.edgesOut
    .sort(byCreatedOn(SortDirection.desc))
    .map(a => a.to)
    .map(toListItem.bind(null, mindset));

  form.successors.forEach(s => {
    const successor = idea.edgesOut.find(a => a.to.id === s.id).to;

    // prevent removing last incoming association from successor
    s.isRemovable = successor.edgesIn.length !== 1;

    // do not show root path (parent and grandparents) of successor idea if this
    // idea is its parent
    s.rootPath = successor.edgeFromParent.from === idea ? null : s.rootPath;
  });

  // preserve previous state
  form.prev.title = form.title;
  form.prev.value = form.value;
  form.prev.color = form.color;
  form.prev.successors = form.successors;

  return form;
}
