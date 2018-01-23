import MindsetType from 'model/entities/Mindset';
import IdeaFormType from 'vm/shared/IdeaForm';

import getIdea from 'action/utils/get-idea';
import toListItem from 'vm/map/mappers/idea-to-list-item';

/**
 * Adds new idea to list of successors
 *
 * @param {IdeaFormType} form
 * @param {MindsetType} mindset
 * @param {string} successorId
 * @return {Partial<IdeaFormType>} update object
 */
export default function addSuccessor(form, mindset, successorId) {
  const successor = getIdea(mindset, successorId);

  const successorItem = toListItem(mindset, successor);
  successorItem.isRemovable = true;

  const successors = form.successors.concat([successorItem]);

  return {
    successors,
    isSaveable: form.isTitleValid,
    isCancelable: !form.isNewIdea
  };
}
