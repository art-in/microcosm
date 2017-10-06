import {expect} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';

import dispatcher from 'src/action/dispatcher';
const dispatch = dispatcher.dispatch.bind(dispatcher);

describe('set-idea-value', () => {
    
    it('should update idea value', async () => {
        
        // setup
        const mindmap = new Mindmap();
        mindmap.ideas.set('id', new Idea({
            id: 'id',
            value: 'old'
        }));

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch({
            type: 'set-idea-value',
            data: {
                ideaId: 'id',
                value: 'new'
            }
        }, state);

        // check
        expect(patch).to.have.length(1);
        expect(patch['update idea']).to.exist;
        expect(patch['update idea'][0].data).to.deep.equal({
            id: 'id',
            value: 'new'
        });
    });

    it('should not mutate if same value', async () => {
        
        // setup
        const mindmap = new Mindmap();
        mindmap.ideas.set('id', new Idea({
            id: 'id',
            value: 'same value'
        }));

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch({
            type: 'set-idea-value',
            data: {
                ideaId: 'id',
                value: 'same value'
            }
        }, state);

        // check
        expect(patch).to.have.length(0);
    });

    it('should target all state layers', async () => {

        // setup
        const mindmap = new Mindmap();
        mindmap.ideas.set('id', new Idea({
            id: 'id',
            value: 'same value'
        }));

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch({
            type: 'set-idea-value',
            data: {
                ideaId: 'id',
                value: 'same value'
            }
        }, state);

        // check
        expect(patch.hasTarget('data')).to.be.true;
        expect(patch.hasTarget('model')).to.be.true;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });
    
});