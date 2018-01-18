import MindsetType from 'model/entities/Mindset';

import getIdea from 'action/utils/get-idea';

/**
 * Gets idea color.
 * 
 * If idea does not have color:
 * - return color from closest parent that does have color (inherit)
 * - if none of parents (including root) have color either - return undefined
 * 
 * @param {MindsetType} mindset 
 * @param {string} ideaId 
 * @return {string|undefined} color
 */
export default function getIdeaColor(mindset, ideaId) {
    const idea = getIdea(mindset, ideaId);

    let color = idea.color;
    let currentIdea = idea;

    while (!color && currentIdea.edgeFromParent) {
        currentIdea = currentIdea.edgeFromParent.from;
        color = currentIdea.color;
    }

    return color;
}