import {expect, createState, combinePatches} from 'test/utils';
import {spy} from 'sinon';

import update from 'src/utils/update-object';
import Point from 'src/model/entities/Point';
import Idea from 'model/entities/Idea';

import mutateVM from 'src/vm/mutators';

import handler from 'src/vm/action/handler';
const handle = handler.handle.bind(handler);

describe('animate-graph-viewbox-to-idea', () => {

    async function setup() {

        // setup state
        //  __________________
        // |vb1     |   canvas|
        // |        |         |
        // |        |         |
        // |________|  _______|
        // |          |vb2    |
        // |          |   x   |
        // |__________|_______|
        //
        const state = createState();

        // setup model
        const {mindmap} = state.model;

        const ideaA = new Idea({
            id: 'A',
            rootPathWeight: 500,
            posAbs: new Point({x: 500, y: 500})
        });

        mindmap.ideas.set(ideaA.id, ideaA);

        // setup view model
        const {graph} = state.vm.main.mindmap;

        update(graph.viewbox, {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            scale: 1
        });

        update(graph.viewport, {
            width: 100,
            height: 100
        });

        // setup spies
        const dispatchSpy = spy();
        const mutateMock = spy(mutateVM.bind(null, state));

        // setup action
        const action = {
            type: 'animate-graph-viewbox-to-idea',
            data: {
                ideaId: 'A',
                scheduleAnimationStep: cb => setTimeout(cb, 50)
            }
        };

        // target
        const res = await handle(state, action, dispatchSpy, mutateMock);

        // combine patches
        const patch = combinePatches(mutateMock, res);

        const mutations = patch['update-graph'];
        const lastMutation = mutations[mutations.length - 1];
        const {viewbox: finalMutationViewbox} = lastMutation.data;

        return {patch, finalMutationViewbox, dispatchSpy};
    }

    it('should set idea to viewbox focus zone', async () => {

        const {finalMutationViewbox: viewbox} = await setup();

        // scale of idea with RPW 500 = 0.5,
        // then viewbox should have scale 2 for target idea to be focused.
        // and if viewbox scale now 2 its size should be 2 times smaller.
        expect(viewbox.scale).to.equal(2);
        expect(viewbox.height).to.equal(50);
        expect(viewbox.width).to.equal(50);
    });

    it('should set idea to the center of viewbox', async () => {

        const {finalMutationViewbox: viewbox} = await setup();

        // viewbox now have size 50x50, target idea position is 500x500,
        // then top-left corner of viewbox should be at (500 - 50/2)
        // for target idea be in the center of viewbox
        expect(viewbox.x).to.equal(475);
        expect(viewbox.y).to.equal(475);
    });

    it(`should dispatch 'set-mindmap-position-and-scale' action`, async () => {

        const {dispatchSpy} = await setup();

        expect(dispatchSpy.callCount).to.equal(1);
        expect(dispatchSpy.firstCall.args).to.have.length(1);
        expect(dispatchSpy.firstCall.args[0]).to.containSubset({
            type: 'set-mindmap-position-and-scale',
            data: {
                scale: 2,
                pos: {x: 475, y: 475}
            }
        });
    });

    it('should progressively increase viewbox scale', async () => {
        
        const {patch} = await setup();

        // collect scale mutations
        const mutations = patch['update-graph'];
        const scales = mutations.reduce(
            (arr, m) => {
                // take only scale mutations 
                if (m.data.viewbox && m.data.viewbox.scale) {
                    arr.push(m.data.viewbox.scale);
                }
                return arr;
            }, []);

        // expect each next scale be greater than previous
        for (let i = 1; i < scales.length; i++) {
            expect(scales[i - 1]).to.be.lte(scales[i]);
        }
    });

    it('should progressively change viewbox position', async () => {
        
        const {patch} = await setup();

        // collect position mutations
        const mutations = patch['update-graph'];
        const positions = mutations.reduce(
            (arr, m) => {
                // take only position mutations 
                if (m.data.viewbox && m.data.viewbox.x && m.data.viewbox.y) {
                    arr.push({x: m.data.viewbox.x, y: m.data.viewbox.y});
                }
                return arr;
            }, []);

        // expect each next position to be greater than previous
        for (let i = 1; i < positions.length; i++) {
            expect(positions[i - 1].x).to.be.lte(positions[i].x);
            expect(positions[i - 1].y).to.be.lte(positions[i].y);
        }
    });

});