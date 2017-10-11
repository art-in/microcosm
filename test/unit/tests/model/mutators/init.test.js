import {expect} from 'test/utils';
import Patch from 'src/utils/state/Patch';
import values from 'src/utils/get-map-values';

import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';
import Mindmap from 'src/model/entities/Mindmap';

import mutate from 'model/mutators';

describe('init', () => {
    
    it('should init mindmap model', () => {

        // setup
        const state = {model: {mindmap: undefined}};

        const entities = {
            ideas: [
                new Idea({id: 'head', isRoot: true}),
                new Idea({id: 'tail'})
            ],
            associations: [
                new Association({fromId: 'head', toId: 'tail'})
            ],
            mindmaps: [
                new Mindmap()
            ]
        };

        const patch = new Patch({type: 'init', data: {entities}});

        // target
        mutate(state, patch);

        // check
        const ideas = values(state.model.mindmap.ideas);
        const assocs = values(state.model.mindmap.associations);

        expect(state.model.mindmap).to.exist;
        expect(state.model.mindmap.root).to.exist;
        expect(ideas).to.have.length(2);
        expect(assocs).to.have.length(1);
    });

    it('should get mindmap with calculated ideas depths', () => {
        
        // setup
        const state = {model: {mindmap: undefined}};

        const entities = {
            ideas: [
                new Idea({id: 'head', isRoot: true}),
                new Idea({id: 'tail'})
            ],
            associations: [
                new Association({fromId: 'head', toId: 'tail'})
            ],
            mindmaps: [
                new Mindmap()
            ]
        };

        const patch = new Patch({type: 'init', data: {entities}});

        // target
        mutate(state, patch);

        // check
        expect(state.model.mindmap.root).to.containSubset({
            id: 'head',
            depth: 0,
            associationsOut: [{
                to: {
                    id: 'tail',
                    depth: 1
                }
            }]
        });
    });

});