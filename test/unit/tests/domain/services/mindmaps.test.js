import {expect} from 'test/utils';

import Mindmap from 'src/domain/models/Mindmap';

import dispatch from 'src/domain/service';

describe('mindmaps', () => {

    describe(`'set-mindmap-position' action`, () => {

        it('should set mindmap position', async () => {

            // setup
            const mindmap = new Mindmap({
                id: 'id',
                x: 100,
                y: 100
            });

            // target
            const patch = await dispatch('set-mindmap-position', {
                mindmapId: 'id',
                pos: {
                    x: 200,
                    y: 200
                }
            }, {mindmap});

            // check
            expect(patch).to.have.length(1);
            expect(patch['update mindmap']).to.exist;
            expect(patch['update mindmap'][0]).to.deep.equal({
                id: 'id',
                x: 200,
                y: 200
            });

        });

    });

    describe(`'set-mindmap-scale' action`, () => {

        it('should set mindmap scale', async () => {

            // setup
            const mindmap = new Mindmap({
                id: 'id',
                scale: 1
            });

            // target
            const patch = await dispatch('set-mindmap-scale', {
                mindmapId: 'id',
                scale: 2
            }, {mindmap});

            // check
            expect(patch).to.have.length(1);
            expect(patch['update mindmap']).to.exist;
            expect(patch['update mindmap'][0]).to.deep.equal({
                id: 'id',
                scale: 2
            });

        });

    });

});