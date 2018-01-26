import IdeaFormType from 'vm/shared/IdeaForm/IdeaForm';

/**
 * Handles toggle gear menu event
 *
 * @param {IdeaFormType} form
 * @return {Partial<IdeaFormType>} update object
 */
export default function onToggleGearMenu(form) {
  return {
    isGearMenuExpanded: !form.isGearMenuExpanded
  };
}
