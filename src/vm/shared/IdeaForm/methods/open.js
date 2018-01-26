import getRootPathVertices from 'utils/graph/get-root-path-vertices';
import getIdea from 'action/utils/get-idea';
import toListItem from 'vm/mappers/idea-to-list-item';

import MindsetType from 'model/entities/Mindset';

import IdeaListItem from 'vm/shared/IdeaListItem';
import IdeaForm from 'vm/shared/IdeaForm';
import toForm from 'vm/mappers/idea-to-form';

/**
 * Opens form for new or existing idea
 *
 * @param {object} opts
 * @param {MindsetType} opts.mindset
 * @param {boolean} [opts.isNewIdea  = false] - is creating new idea
 * @param {string} [opts.parentIdeaId] - ID of parent idea if creating new idea
 * @param {string} [opts.ideaId] - ID of existing idea
 * @return {IdeaForm}
 */
export default function open(opts) {
  const {mindset, isNewIdea = false, parentIdeaId, ideaId} = opts;

  if (isNewIdea && parentIdeaId === undefined) {
    throw Error('Not received ID of parent idea');
  }

  if (!isNewIdea && ideaId === undefined) {
    throw Error('Not received ID of existing idea');
  }

  let form;

  if (isNewIdea) {
    // open form for new idea
    form = new IdeaForm();

    form.ideaId = null;
    form.parentIdeaId = parentIdeaId;
    form.isNewIdea = true;

    form.title = '';
    form.value = '';
    form.color = '';
    form.successors = [];

    form.isRemoveAvailable = false;
    form.isTitleValid = false;
    form.shouldFocusTitleOnShow = true;
    form.isEditingValue = true;
    form.isGearMenuAvailable = false;
    form.isGearMenuExpanded = false;
    form.isSuccessorsEditable = false;
    form.isSaveable = false;
    form.isCancelable = false;

    const parent = getIdea(mindset, parentIdeaId);

    const rootPathIdeas = getRootPathVertices(mindset.root, parent);
    form.rootPath = rootPathIdeas.map(
      idea =>
        new IdeaListItem({
          id: idea.id,
          title: idea.title,
          tooltip: idea.title
        })
    );

    form.predecessors = [toListItem(mindset, parent)];
  } else {
    // open form for existing idea
    const idea = getIdea(mindset, ideaId);
    form = toForm(mindset, idea);
  }

  return form;
}
