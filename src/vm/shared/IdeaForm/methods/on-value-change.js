import IdeaFormType from 'vm/shared/IdeaForm/IdeaForm';

/**
 * Handles value change event
 *
 * @param {IdeaFormType} form
 * @param {string} value - new value
 * @return {Partial<IdeaFormType>} update object
 */
export default function onValueChange(form, value) {
  return {
    value,
    isSaveable: form.isTitleValid,
    isCancelable: !form.isNewIdea
  };
}
