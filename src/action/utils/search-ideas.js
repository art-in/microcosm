import values from 'utils/get-map-values';

import IdeaType from 'model/entities/Idea';
import MindmapType from 'model/entities/Mindmap';

/**
 * Searches ideas
 * 
 * @param {MindmapType} mindmap 
 * @param {object} opts
 * @param {string} opts.phrase
 * @param {Object.<string>} [opts.excludeIds]
 * @return {Array.<IdeaType>}
 */
export default function searchIdeas(mindmap, opts) {
    const {phrase, excludeIds} = opts;
    
    if (!phrase) {
        throw Error('Search string is empty');
    }

    return values(mindmap.ideas)
        .filter(idea => {
            if (excludeIds && excludeIds.includes(idea.id)) {
                return false;
            }

            const regexp = new RegExp(phrase, 'i');

            return (idea.title && idea.title.match(regexp)) ||
                (idea.value && idea.value.match(regexp));
        });
}