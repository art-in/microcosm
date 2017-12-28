import {expect, createState, combinePatches} from 'test/utils';
import {spy} from 'sinon';

import update from 'src/utils/update-object';
import Point from 'src/model/entities/Point';

import handler from 'src/vm/action/handler';
const handle = handler.handle.bind(handler);

describe('animate-mindmap-zoom', () => {

    it('should NOT update mindmap if animation in progress', async () => {

        // setup state
        const state = createState();
        const {mindmap} = state.vm.main.mindset;

        mindmap.viewbox.x = mindmap.viewbox.y = 0;
        mindmap.viewbox.scale = 1;

        mindmap.zoomInProgress = true;

        // setup spies
        const dispatch = spy();
        const mutate = spy();

        // setup action
        const action = {
            type: 'animate-mindmap-zoom',
            data: {
                up: true,
                viewportPos: new Point({x: 0, y: 0}),
                scheduleAnimationStep: cb => cb()
            }
        };

        // target
        const res = await handle(state, action, dispatch, mutate);

        // check
        const patch = combinePatches(mutate, res);
        
        expect(patch['update-mindmap']).to.not.exist;
    });

    it('should not update mindmap if zoom limit reached', async () => {
        
        // setup state
        const state = createState();
        const {mindmap} = state.vm.main.mindset;
        mindmap.viewbox.x = mindmap.viewbox.y = 0;

        mindmap.viewbox.scale = 0.5;
        mindmap.viewbox.scaleMin = 0.5;

        // setup spies
        const dispatch = spy();
        const mutate = spy();

        // setup action
        const action = {
            type: 'animate-mindmap-zoom',
            data: {
                up: false,
                viewportPos: new Point({x: 0, y: 0}),
                scheduleAnimationStep: cb => cb()
            }
        };

        // target
        const res = await handle(state, action, dispatch, mutate);

        // check
        const patch = combinePatches(mutate, res);
        
        expect(patch['update-mindmap']).to.not.exist;
    });

    it(`should dispatch 'set-mindset-position-and-scale' action`, async () => {
        
        // setup state
        const state = createState();
        const {mindmap} = state.vm.main.mindset;

        update(mindmap.viewbox, {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            scale: 1
        });

        update(mindmap.viewport, {
            width: 100,
            height: 100
        });

        // setup spies
        const dispatch = spy();
        const mutate = spy(() => mindmap.viewbox.scale = 1.5);

        // setup action
        const action = {
            type: 'animate-mindmap-zoom',
            data: {
                up: true,
                viewportPos: new Point({x: 0, y: 0}),
                scheduleAnimationStep: cb => setTimeout(cb, 100)
            }
        };

        // target
        await handle(state, action, dispatch, mutate);

        // check
        expect(dispatch.callCount).to.equal(1);
        expect(dispatch.firstCall.args).to.have.length(1);
        expect(dispatch.firstCall.args[0]).to.containSubset({
            type: 'set-mindset-position-and-scale',
            data: {
                scale: 1.5,
                pos: {x: 0, y: 0}
            }
        });
    });

    it('should move mindmap viewbox towards zoom point', async () => {
        
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
        const {mindmap} = state.vm.main.mindset;

        update(mindmap.viewbox, {
            x: 50,
            y: 50,
            width: 100,
            height: 100,
            scale: 2
        });

        update(mindmap.viewport, {
            width: 200,
            height: 200
        });

        // setup spies
        const dispatch = spy();
        const mutate = patch => update(mindmap, patch[0].data);

        // setup action
        // zoom into lower-right corner of the viewport (200, 200),
        // which should map to lower-right corner of viewbox (100, 100),
        // and adding position of viewbox we get (150, 150) which is
        // absolute coordinates of zoom target point on canvas.
        const action = {
            type: 'animate-mindmap-zoom',
            data: {
                up: true,
                viewportPos: new Point({x: 200, y: 200}),
                scheduleAnimationStep: cb => setTimeout(cb, 50)
            }
        };

        // target
        await handle(state, action, dispatch, mutate);

        // check
        expect(mindmap.viewbox).to.containSubset({

            // scale will be rased to 3 (2 x 1.5 times)
            // 0.5 is hardcoded zoom step
            scale: 3,

            // width/height will be 1.5 times smaller
            // 100 / 1.5 = 67
            width: 100 / 1.5,
            height: 100 / 1.5,

            // zoom target position was at the corner of the viewport/viewbox,
            // so full hidden area will go to left side (100 - 67 = 33)
            // prev position (50) + hidden area on the left (33) = 83
            x: (100 - (100 / 1.5)) + 50,
            y: (100 - (100 / 1.5)) + 50
        });
    });

    describe('zoom in', () => {

        let patch;

        beforeEach(async () => {

            // setup state
            const state = createState();
            const {mindmap} = state.vm.main.mindset;

            update(mindmap.viewbox, {
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                scale: 1
            });

            update(mindmap.viewport, {
                width: 100,
                height: 100
            });

            // setup spies
            const dispatch = spy();
            const mutate = spy();

            // setup action
            const action = {
                type: 'animate-mindmap-zoom',
                data: {
                    up: true,
                    viewportPos: new Point({x: 0, y: 0}),
                    scheduleAnimationStep: cb => setTimeout(cb, 50)
                }
            };

            // target
            const res = await handle(state, action, dispatch, mutate);

            // check
            patch = combinePatches(mutate, res);

        });

        it('should rise progress flag before animation', () => {
            expect(patch['update-mindmap'][0].data).to.deep.equal({
                zoomInProgress: true
            });
        });

        it('should drop progress flag after animation', () => {
            const mutations = patch['update-mindmap'];
            expect(mutations[mutations.length - 1].data).to.deep.equal({
                zoomInProgress: false
            });
        });

        it('should progressively increase scale', () => {

            // collect scale mutations
            const mutations = patch['update-mindmap'];
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