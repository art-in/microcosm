import {expect, createState} from 'test/utils';

import Patch from 'utils/state/Patch';

import mutate from 'view/mutators';

describe('mutators', () => {

    describe('init', () => {

        it('should init view', () => {
            
            // setup
            const state = createState();
            state.view.root = undefined;

            const patch = new Patch({
                type: 'init',
                data: {
                    view: {
                        root: document.createElement('div'),
                        storeDispatch: () => {}
                    }
                }
            });

            // target
            mutate(state, patch);

            // check
            const {root} = state.view;

            expect(root).to.exist;
            expect(root).to.be.instanceOf(HTMLElement);
        });

    });

});