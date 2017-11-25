import required from 'utils/required-params';
import values from 'utils/get-map-values';

/**
 * Searches ideas
 * @param {Mindmap}         mindmap 
 * @param {object}          opts
 * @param {string}          opts.phrase
 * @param {object.<string>} [opts.excludeIds]
 * @return {array.<Idea>}
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