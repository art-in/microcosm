import IdeaType from 'model/entities/Idea';
import MindmapType from 'model/entities/Mindmap';

/**
 * Gets idea by ID
 *
 * @param {MindmapType} mindmap
 * @param {string} ideaId
 * @return {IdeaType}
 */
export default function getIdea(mindmap, ideaId) {
    
    const idea = mindmap.ideas.get(ideaId);

    if (!idea) {
        throw Error(`Idea '${ideaId}' was not found in mindmap`);
    }

    return idea;
}