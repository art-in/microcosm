import IdeaFormType from 'vm/shared/IdeaForm/IdeaForm';

import isValidIdeaTitle from 'action/utils/is-valid-idea-title';

/**
 * Handles title change event
 *
 * @param {IdeaFormType} form
 * @param {string} title - new title
 * @return {Partial<IdeaFormType>} update object
 */
export default function onTitleChange(form, title) {
  const isTitleValid = isValidIdeaTitle(title);

  return {
    title,
    isTitleValid,
    isSaveable: isTitleValid,
    isCancelable: !form.isNewIdea
  };
}
