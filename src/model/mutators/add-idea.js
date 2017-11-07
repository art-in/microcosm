import required from 'utils/required-params';
import values from 'utils/get-map-values';

import weighRootPaths from 'utils/graph/weigh-root-paths';

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

        // init link arrays
        idea.associationsIn = [];
        idea.associationsOut = [];
        idea.linkFromParent = null;
        idea.linksToChilds = [];

        idea.rootPathWeight = 0;

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
    }

    idea.associationsOut = [];

    weighRootPaths(mindmap.root);
}