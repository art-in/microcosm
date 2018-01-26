import IdeaFormType from 'vm/shared/IdeaForm/IdeaForm';

/**
 * Handles color change event
 *
 * @param {IdeaFormType} form
 * @param {string} color
 * @return {Partial<IdeaFormType>} update object
 */
export default function onColorChange(form, color) {
  return {
    color,
    isSaveable: form.isTitleValid,
    isCancelable: !form.isNewIdea
  };
}
