import {expect, createState} from 'test/utils';

import Patch from 'state/Patch';


import mutate from 'state/mutator/view';

describe('view', () => {

    describe(`'init' mutation`, () => {

        it('should init view', async () => {

            // setup
            const initial = createState();
            initial.view.root = undefined;

            const patch = new Patch(
                'init', {
                    view: {
                        root: document.createElement('div')
                    }
                }
            );

            // target
            const result = await mutate(initial, patch);

            // check
            expect(result.root).to.exist;
            expect(result.root).to.be.instanceOf(window.HTMLElement);
        });

    });

});