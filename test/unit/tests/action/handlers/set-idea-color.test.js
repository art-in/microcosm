import {expect} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';

import dispatcher from 'src/action/dispatcher';
const dispatch = dispatcher.dispatch.bind(dispatcher);

describe('set-idea-color', () => {
    
    it('should set idea color', async () => {

        // setup
        const mindmap = new Mindmap();
        mindmap.ideas.set('id', new Idea({
            id: 'id',
            color: 'black'
        }));

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch('set-idea-color', {
            ideaId: 'id',
            color: 'white'
        }, state);

        // check
        expect(patch).to.have.length(1);
        expect(patch['update idea']).to.exist;
        expect(patch['update idea'][0]).to.deep.equal({
            id: 'id',
            color: 'white'
        });

    });

});