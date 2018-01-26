import IdeaFormType from 'vm/shared/IdeaForm/IdeaForm';

/**
 * Handles color remove event
 *
 * @param {IdeaFormType} form
 * @return {Partial<IdeaFormType>} update object
 */
export default function onColorRemove(form) {
  return {
    color: null,
    isSaveable: form.isTitleValid,
    isCancelable: !form.isNewIdea
  };
}
