import IdeaFormType from 'vm/shared/IdeaForm';

/**
 * Cleans form
 *
 * @return {Partial<IdeaFormType>} update object
 */
export default function clean() {
  return {
    ideaId: null,
    parentIdeaId: null,
    isNewIdea: null
  };
}
