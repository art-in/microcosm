import IdeaFormType from 'vm/shared/IdeaForm/IdeaForm';

/**
 * Handles toggle value edit event
 *
 * @param {IdeaFormType} form
 * @return {Partial<IdeaFormType>} update object
 */
export default function onToggleValueEdit(form) {
  return {
    isEditingValue: !form.isEditingValue
  };
}
