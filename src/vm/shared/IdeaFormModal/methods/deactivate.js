import cleanForm from "vm/shared/IdeaForm/methods/clean";

/**
 * Deactivates form modal
 *
 * @return {object} update object
 */
export default function() {
  return {
    modal: {
      active: false
    },
    form: cleanForm()
  };
}
