import IdeaFormType from 'vm/shared/IdeaForm/IdeaForm';

/**
 * Handles cancel edit event
 *
 * @param {IdeaFormType} form
 * @return {Partial<IdeaFormType>} update object
 */
export default function onCancel(form) {
  return {
    title: form.prev.title,
    value: form.prev.value,
    color: form.prev.color || null,
    successors: form.prev.successors,
    isTitleValid: true,
    isEditingValue: false,
    isSaveable: false,
    isCancelable: false
  };
}
