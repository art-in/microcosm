import createId from 'utils/create-id';
import getIdea from 'action/utils/get-idea';
import diffArrays from 'utils/diff-arrays';

import MindsetType from 'model/entities/Mindset';
import IdeaFormType from 'vm/shared/IdeaForm/IdeaForm';

/**
 * Handles form save event
 *
 * @param {IdeaFormType} form
 * @param {MindsetType} mindset
 * @param {function} dispatch
 * @return {string|undefined} ID of saved idea or undefined if operation ignored
 */
export default function onSave(form, mindset, dispatch) {
  if (!form.isSaveable) {
    // do not save if there was no changes
    return;
  }

  const title = form.title.trim();
  let ideaId;

  if (form.isNewIdea) {
    // create new idea
    ideaId = createId();

    dispatch({
      type: 'create-idea',
      data: {
        parentIdeaId: form.parentIdeaId,
        title,
        value: form.value,
        ideaId
      }
    });
  } else {
    // save changes to existing idea
    ideaId = form.ideaId;

    dispatch({
      type: 'set-idea-title-and-value',
      data: {
        ideaId: form.ideaId,
        title,
        value: form.value
      }
    });
  }

  const idea = getIdea(mindset, ideaId);

  // save color
  if (form.color !== form.prev.color) {
    dispatch({
      type: 'set-idea-color',
      data: {
        ideaId,
        color: form.color
      }
    });
  }

  // save successors
  const oldSuccessorIds = idea.edgesOut.map(e => e.to.id);
  const newSuccessorIds = form.successors.map(i => i.id);

  const diff = diffArrays(oldSuccessorIds, newSuccessorIds);

  diff.add.forEach(successorId =>
    dispatch({
      type: 'create-cross-association',
      data: {
        headIdeaId: idea.id,
        tailIdeaId: successorId
      }
    })
  );

  diff.del
    .map(
      successorId =>
        // get ids of corresponding associations
        idea.edgesOut.find(a => a.to.id === successorId).id
    )
    .forEach(assocId =>
      dispatch({
        type: 'remove-association',
        data: {assocId}
      })
    );

  return ideaId;
}
