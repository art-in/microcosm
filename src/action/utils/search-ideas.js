import required from 'utils/required-params';
import values from 'utils/get-map-values';

import IdeaType from 'model/entities/Idea';
import MindmapType from 'model/entities/Mindmap';

/**
 * Searches ideas
 * @param {MindmapType} mindmap 
 * @param {object}           opts
 * @param {string}           opts.phrase
 * @param {Object.<string>} [opts.excludeIds]
 * @return {Array.<IdeaType>}
 */
export default function searchIdeas(mindmap, opts) {
    const {phrase} = required(opts);
    const {excludeIds} = opts;
    
    if (!phrase) {
        throw Error('Search string is empty');
    }

    // TODO: search case-insensitively
    return values(mindmap.ideas)
        .filter(i =>
            (!excludeIds || !excludeIds.includes(i.id)) &&
            i.value && i.value.includes(phrase));
}