import {expect, createState} from 'test/utils';

import Patch from 'utils/state/Patch';

import mutate from 'view/mutators';

describe('init', () => {

    it('should init view', async () => {

        // setup
        const state = createState();
        state.view.root = undefined;

        const patch = new Patch(
            'init', {
                view: {
                    root: document.createElement('div')
                }
            }
        );

        // target
        const result = await mutate(state, patch);

        // check
        const {root} = result.view;

        expect(root).to.exist;
        expect(root).to.be.instanceOf(window.HTMLElement);
    });

});