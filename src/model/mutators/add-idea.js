import required from 'utils/required-params';
import values from 'utils/get-map-values';

/**
 * Adds idea
 * 
 * @param {object} state 
 * @param {object} data
 * @param {Idea}   data.idea
 */
export default function addIdea(state, data) {
    const {model: {mindmap}} = state;
    const {idea} = required(data);

    mindmap.ideas.set(idea.id, idea);

    if (idea.isRoot) {

        // add root idea
        if (mindmap.root) {
            throw Error('Mindmap already has root idea');
        }

        mindmap.root = idea;

        // no incomming associations needed
        // for root idea
        idea.associationsIn = [];

        idea.depth = 0;

    } else {

        // bind with incoming associations
        const incomingAssocs = values(mindmap.associations)
            .filter(a => a.toId === idea.id);
    
        if (!incomingAssocs.length) {
            // incoming association should be added first.
            // hanging ideas are not allowed
            throw Error(
                `No incoming associations found for idea '${idea.id}'`);
        }

        incomingAssocs.forEach(a => a.to = idea);
        idea.associationsIn = incomingAssocs;

        // set depth (min parent depth + 1)
        const parents = incomingAssocs.map(assoc => assoc.from);
        const parentDepths = parents.map(parent => {
            if (parent.depth === undefined) {
                throw Error(`Parent idea '${parent.id}' does not have depth`);
            }

            return parent.depth;
        });

        idea.depth = Math.min(...parentDepths) + 1;
    }

    idea.associationsOut = [];
}