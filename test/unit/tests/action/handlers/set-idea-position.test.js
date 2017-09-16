import {expect} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';

import dispatcher from 'src/action/dispatcher';
const dispatch = dispatcher.dispatch.bind(dispatcher);

describe(`'set-idea-position' action`, () => {
    
    it('should set idea position', async () => {

        // setup
        const mindmap = new Mindmap();
        mindmap.ideas.set('id', new Idea({
            id: 'id',
            x: 100,
            y: 100
        }));

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch('set-idea-position', {
            ideaId: 'id',
            pos: {
                x: 200,
                y: 200
            }
        }, state);

        // check
        expect(patch).to.have.length(1);
        expect(patch['update idea']).to.exist;
        expect(patch['update idea'][0]).to.deep.equal({
            id: 'id',
            x: 200,
            y: 200
        });

    });

});