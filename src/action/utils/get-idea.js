import IdeaType from 'model/entities/Idea';
import MindsetType from 'model/entities/Mindset';

/**
 * Gets idea by ID
 *
 * @param {MindsetType} mindset
 * @param {string} ideaId
 * @return {IdeaType}
 */
export default function getIdea(mindset, ideaId) {
    
    const idea = mindset.ideas.get(ideaId);

    if (!idea) {
        throw Error(`Idea '${ideaId}' was not found in mindset`);
    }

    return idea;
}