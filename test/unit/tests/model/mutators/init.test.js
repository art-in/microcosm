import {expect} from 'test/utils';
import Patch from 'src/utils/state/Patch';
import values from 'src/utils/get-map-values';

import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';
import Mindmap from 'src/model/entities/Mindmap';
import Point from 'src/model/entities/Point';

import mutate from 'model/mutators';

describe('init', () => {
    
    it('should init mindmap model', () => {

        // setup
        const state = {model: {mindmap: undefined}};

        const entities = {
            ideas: [
                new Idea({
                    id: 'head',
                    isRoot: true,
                    pos: new Point({x: 0, y: 0})
                }),
                new Idea({
                    id: 'tail',
                    pos: new Point({x: 100, y: 100})
                })
            ],
            associations: [
                new Association({fromId: 'head', toId: 'tail', weight: 1})
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

    it('should get mindmap with calculated idea root path weights', () => {
        
        // setup
        const state = {model: {mindmap: undefined}};

        const entities = {
            ideas: [
                new Idea({
                    id: 'head',
                    isRoot: true,
                    pos: new Point({x: 0, y: 0})
                }),
                new Idea({
                    id: 'tail',
                    pos: new Point({x: 0, y: 100})
                })
            ],
            associations: [
                new Association({fromId: 'head', toId: 'tail', weight: 100})
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
            rootPathWeight: 0,
            associationsOut: [{
                to: {
                    id: 'tail',
                    rootPathWeight: 100
                }
            }]
        });
    });

});