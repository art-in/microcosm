import {expect, createDB} from 'test/utils';

import mutate from 'model/mutators';

import Patch from 'src/utils/state/Patch';
import values from 'src/utils/get-map-values';

describe('init', () => {
    
    it('should init mindmap model from db', async () => {

        // setup
        const state = {model: {mindmap: undefined}};

        const patchData = {
            data: {
                ideas: createDB(),
                associations: createDB(),
                mindmaps: createDB()
            }
        };

        await patchData.data.ideas.post({_id: 'head', isRoot: true});
        await patchData.data.ideas.post({_id: 'tail'});
        await patchData.data.associations.post({
            fromId: 'head',
            toId: 'tail'
        });
        await patchData.data.mindmaps.post({});

        const patch = new Patch({type: 'init', data: patchData});

        // target
        const result = await mutate(state, patch);

        // check
        const ideas = values(result.model.mindmap.ideas);
        const assocs = values(result.model.mindmap.associations);

        expect(result.model.mindmap).to.exist;
        expect(result.model.mindmap.root).to.exist;
        expect(ideas).to.have.length(2);
        expect(assocs).to.have.length(1);
    });

    it('should get mindmap with calculated ideas depths', async () => {
        
        // setup
        const state = {model: {mindmap: undefined}};

        const patchData = {
            data: {
                ideas: createDB(),
                associations: createDB(),
                mindmaps: createDB()
            }
        };

        await patchData.data.ideas.post({_id: 'head', isRoot: true});
        await patchData.data.ideas.post({_id: 'tail'});
        await patchData.data.associations.post({
            fromId: 'head',
            toId: 'tail'
        });
        await patchData.data.mindmaps.post({});

        const patch = new Patch({type: 'init', data: patchData});

        // target
        const result = await mutate(state, patch);

        // check
        expect(result.model.mindmap.root).to.containSubset({
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