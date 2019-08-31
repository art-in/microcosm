import IdeaFormType from 'vm/shared/IdeaForm';

/**
 * Should form container be scrolled top when opening idea?
 *
 * @param {string} ideaId
 * @param {IdeaFormType} prevForm
 * @return {boolean}
 */
export default function(ideaId, prevForm) {
  return !prevForm || (ideaId != prevForm.ideaId && !prevForm.isNewIdea);
}
