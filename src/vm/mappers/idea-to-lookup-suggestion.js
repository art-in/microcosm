import IdeaType from 'model/entities/Idea';
import LookupSuggestion from 'vm/shared/LookupSuggestion';

/**
 * Maps idea model to lookup suggestion view model
 *
 * @param {IdeaType} idea
 * @return {LookupSuggestion}
 */
export default function ideaToSuggestion(idea) {
  return new LookupSuggestion({
    displayName: idea.title,
    data: {ideaId: idea.id}
  });
}
