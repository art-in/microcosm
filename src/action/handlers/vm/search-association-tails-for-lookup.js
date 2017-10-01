import Patch from 'utils/state/Patch';

import searchIdeas from 'action/utils/search-ideas';
import getIdea from 'action/utils/get-idea';

/**
 * Searches and sets suggesting ideas to lookup
 * which selects tail idea for cross-association
 * 
 * @param {object} data
 * @param {string} data.phrase 
 * @param {string} data.headIdeaId 
 * @param {object} state
 * @return {Patch}
 */
export default function searchAssociationTailsForLookup(
    {phrase, headIdeaId}, {model: {mindmap}}) {

    const headIdea = getIdea(mindmap, headIdeaId);

    const excludeIds = [];
    
    // exclude head
    excludeIds.push(headIdeaId);

    // exclude child ideas
    const childIds = headIdea.associationsOut.map(a => a.to.id);
    excludeIds.push(...childIds);

    // exclude parent ideas
    const parentIds = headIdea.associationsIn.map(a => a.from.id);
    excludeIds.push(...parentIds);

    // exclude root idea
    excludeIds.push(mindmap.root.id);

    const ideas = searchIdeas(mindmap, {phrase, excludeIds});

    return new Patch([{
        type: 'set-association-tails-to-lookup',
        data: {ideas},
        targets: ['vm', 'view']
    }]);
}