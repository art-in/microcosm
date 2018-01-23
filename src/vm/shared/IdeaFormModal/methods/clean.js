import cleanForm from 'vm/shared/IdeaForm/methods/clean';

/**
 * Cleans form modal
 *
 * @return {object} update object
 */
export default function() {
  return {
    form: cleanForm()
  };
}
