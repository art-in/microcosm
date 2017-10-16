import {expect} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('set-mindmap-scale', () => {
    
    it('should set mindmap scale', () => {

        // setup
        const mindmap = new Mindmap({
            id: 'id',
            scale: 1
        });

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'set-mindmap-scale',
            data: {
                mindmapId: 'id',
                scale: 2,
                pos: {}
            }
        });

        // check
        expect(patch).to.have.length(1);
        expect(patch['update-mindmap']).to.exist;
        expect(patch['update-mindmap'][0].data).to.containSubset({
            id: 'id',
            scale: 2
        });

    });

    it('should set mindmap position', () => {
        
        // setup
        const mindmap = new Mindmap({
            id: 'id',
            scale: 1
        });

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'set-mindmap-scale',
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
        expect(patch).to.have.length(1);
        expect(patch['update-mindmap']).to.exist;
        expect(patch['update-mindmap'][0].data).to.containSubset({
            id: 'id',
            x: 100,
            y: 200
        });

    });

    it('should target all state layers', () => {

        // setup
        const mindmap = new Mindmap({
            id: 'id',
            scale: 1
        });

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'set-mindmap-scale',
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