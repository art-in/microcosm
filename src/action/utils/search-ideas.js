import values from 'utils/get-map-values';

/**
 * Searches ideas
 * @param {Mindmap} mindmap 
 * @param {object}          options
 * @param {string}          options.phrase
 * @param {object.<string>} options.excludeIds
 * @return {array.<Idea>}
 */
export default function searchIdeas(mindmap, {
    phrase,
    excludeIds
}) {
    
    if (!phrase) {
        throw Error('Search string is empty');
    }

    return values(mindmap.ideas)
        .filter(i =>
            (!excludeIds || !excludeIds.includes(i.id)) &&
            i.value && i.value.includes(phrase));
}