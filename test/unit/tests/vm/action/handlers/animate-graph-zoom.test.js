import {expect, createState, combinePatches} from 'test/utils';
import {spy} from 'sinon';

import update from 'src/utils/update-object';
import Point from 'src/vm/shared/Point';

import handler from 'src/vm/action/handler';
const handle = handler.handle.bind(handler);

describe('animate-graph-zoom', () => {

    it('should not update graph if animation already in progress', async () => {

        // setup state
        const state = createState();
        const {graph} = state.vm.main.mindmap;

        graph.viewbox.x = graph.viewbox.y = 0;
        graph.viewbox.scale = 1;

        graph.zoomInProgress = true;

        // setup spies
        const dispatch = spy();
        const mutate = spy();

        // setup action
        const action = {
            type: 'animate-graph-zoom',
            data: {
                up: true,
                pos: new Point({x: 0, y: 0}),
                scheduleAnimationStep: cb => cb()
            }
        };

        // target
        const res = await handle(state, action, dispatch, mutate);

        // check
        const patch = combinePatches(mutate, res);
        
        expect(patch['update-graph']).to.not.exist;
    });

    it('should not update graph if zoom limit reached', async () => {
        
        // setup state
        const state = createState();
        const {graph} = state.vm.main.mindmap;
        graph.viewbox.x = graph.viewbox.y = 0;

        graph.viewbox.scale = 0.5;
        graph.viewbox.scaleMin = 0.5;

        // setup spies
        const dispatch = spy();
        const mutate = spy();

        // setup action
        const action = {
            type: 'animate-graph-zoom',
            data: {
                up: false,
                pos: new Point({x: 0, y: 0}),
                scheduleAnimationStep: cb => cb()
            }
        };

        // target
        const res = await handle(state, action, dispatch, mutate);

        // check
        const patch = combinePatches(mutate, res);
        
        expect(patch['update-graph']).to.not.exist;
    });

    it(`should dispatch 'set-mindmap-scale' action`, async () => {
        
        // setup state
        const state = createState();
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
        const dispatch = spy();
        const mutate = spy(() => graph.viewbox.scale = 1.5);

        // setup action
        const action = {
            type: 'animate-graph-zoom',
            data: {
                up: true,
                pos: new Point({x: 0, y: 0}),
                scheduleAnimationStep: cb => setTimeout(cb, 100)
            }
        };

        // target
        await handle(state, action, dispatch, mutate);

        // check
        expect(dispatch.callCount).to.equal(1);
        expect(dispatch.firstCall.args).to.have.length(1);
        expect(dispatch.firstCall.args[0]).to.containSubset({
            type: 'set-mindmap-scale',
            data: {
                scale: 1.5,
                pos: {x: 0, y: 0}
            }
        });
    });

    it('should move graph viewbox towards zoom point', async () => {
        
        // setup state
        //
        //  _____________
        // |canvas       |
        // |      _______|
        // |     |vb1____|
        // |     |  |vb2 |
        // |_____|__|___x|
        //
        const state = createState();
        const {graph} = state.vm.main.mindmap;

        update(graph.viewbox, {
            x: 50,
            y: 50,
            width: 100,
            height: 100,
            scale: 2
        });

        update(graph.viewport, {
            width: 200,
            height: 200
        });

        // setup spies
        const dispatch = spy();
        const mutate = patch => update(graph, patch[0].data);

        // setup action
        // zoom into lower-right corner of the viewport (200, 200),
        // which should map to lower-right corner of viewbox (100, 100),
        // and adding position of viewbox we get (150, 150) which is
        // absolute coordinates of zoom target point on canvas.
        const action = {
            type: 'animate-graph-zoom',
            data: {
                up: true,
                pos: new Point({x: 200, y: 200}),
                scheduleAnimationStep: cb => setTimeout(cb, 50)
            }
        };

        // target
        await handle(state, action, dispatch, mutate);

        // check
        expect(graph.viewbox).to.containSubset({

            // scale will be rased to 3 (2 x 1.5 times)
            // 0.5 is hardcoded zoom step
            scale: 3,

            // width/height will be 1.5 times smaller
            // 100 x 1.5 = 67
            width: 67,
            height: 67,

            // zoom target position was at the corner of the viewport/viewbox,
            // so full hidden area will go to left side (100 - 67 = 33)
            // prev position (50) + hidden area on the left (33) = 83
            x: 83,
            y: 83
        });
    });

    describe('zoom in', () => {

        let patch;

        beforeEach(async () => {

            // setup state
            const state = createState();
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
            const dispatch = spy();
            const mutate = spy();

            // setup action
            const action = {
                type: 'animate-graph-zoom',
                data: {
                    up: true,
                    pos: new Point({x: 0, y: 0}),
                    scheduleAnimationStep: cb => setTimeout(cb, 50)
                }
            };

            // target
            const res = await handle(state, action, dispatch, mutate);

            // check
            patch = combinePatches(mutate, res);

        });

        it('should rise progress flag before animation', () => {
            expect(patch['update-graph'][0].data).to.deep.equal({
                zoomInProgress: true
            });
        });

        it('should drop progress flag after animation', () => {
            const mutations = patch['update-graph'];
            expect(mutations[mutations.length - 1].data).to.deep.equal({
                zoomInProgress: false
            });
        });

        it('should progressively increase scale', () => {

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
    });

});