import IdeaFormType from 'vm/shared/IdeaForm/IdeaForm';

/**
 * Handles value double click event
 *
 * @param {IdeaFormType} form
 * @return {Partial<IdeaFormType>|undefined} update object
 */
export default function onValueDoubleClick(form) {
  if (form.isEditingValue) {
    // do not exit edit mode by double click, because otherwise it is
    // impossible to select word in text area (default behavior)
    return undefined;
  }

  return {
    isEditingValue: true
  };
}
