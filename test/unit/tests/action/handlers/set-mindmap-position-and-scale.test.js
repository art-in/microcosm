import {expect} from 'test/utils';
import clone from 'clone';

import Mindmap from 'src/model/entities/Mindmap';
import Point from 'model/entities/Point';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('set-mindmap-position-and-scale', () => {
    
    it('should set mindmap position and scale', () => {

        // setup
        const mindmap = new Mindmap({
            id: 'id',
            scale: 1,
            pos: new Point({x: 0, y: 0})
        });

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'set-mindmap-position-and-scale',
            data: {
                mindmapId: 'id',
                pos: {x: 10, y: 10},
                scale: 2
            }
        });

        // check
        const mutations = patch['update-mindmap'];
        expect(mutations).to.have.length(1);
        
        expect(mutations[0].data).to.containSubset({
            id: 'id',
            pos: {x: 10, y: 10},
            scale: 2
        });

    });

    it('should set mindmap position', () => {
        
        // setup
        const mindmap = new Mindmap({
            id: 'id',
            scale: 1,
            pos: new Point({x: 0, y: 0})
        });

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'set-mindmap-position-and-scale',
            data: {
                mindmapId: 'id',
                pos: {
                    x: 100,
                    y: 200
                }
            }
        });

        // check
        const mutations = patch['update-mindmap'];
        expect(mutations).to.have.length(1);
        
        expect(mutations[0].data).to.containSubset({
            id: 'id',
            pos: {x: 100, y: 200}
        });
    });

    it('should NOT set position if it was not changed', () => {
        
        // setup
        const mindmap = new Mindmap({
            id: 'id',
            scale: 1,
            pos: new Point({
                x: 100,
                y: 200
            })
        });

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'set-mindmap-position-and-scale',
            data: {
                mindmapId: 'id',
                scale: 2,
                pos: {
                    x: 100,
                    y: 200
                }
            }
        });

        // check
        const mutations = patch['update-mindmap'];
        expect(mutations).to.have.length(1);
        
        expect(mutations[0].data).to.deep.equal({
            id: 'id',
            scale: 2
        });
    });

    it('should NOT set scale if it was not changed', () => {
        
        // setup
        const mindmap = new Mindmap({
            id: 'id',
            scale: 1,
            pos: new Point({
                x: 100,
                y: 200
            })
        });

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'set-mindmap-position-and-scale',
            data: {
                mindmapId: 'id',
                scale: 1,
                pos: {
                    x: 100,
                    y: 200
                }
            }
        });

        // check
        const mutations = patch['update-mindmap'];
        expect(mutations).to.equal(undefined);
    });

    it('should NOT mutate state', () => {
        
        // setup
        const mindmap = new Mindmap({
            id: 'id',
            scale: 1,
            pos: new Point({x: 0, y: 0})
        });

        const state = {model: {mindmap}};
        const stateBefore = clone(state);

        // target
        handle(state, {
            type: 'set-mindmap-position-and-scale',
            data: {
                mindmapId: 'id',
                scale: 2,
                pos: {x: 10, y: 10}
            }
        });

        // check
        expect(state).to.deep.equal(stateBefore);
    });

    it('should target all state layers', () => {

        // setup
        const mindmap = new Mindmap({
            id: 'id',
            scale: 1,
            pos: new Point({x: 0, y: 0})
        });

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'set-mindmap-position-and-scale',
            data: {
                mindmapId: 'id',
                scale: 2,
                pos: {}
            }
        });

        // check
        expect(patch.hasTarget('data')).to.be.true;
        expect(patch.hasTarget('model')).to.be.true;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });

});