import {expect, createState} from 'test/utils';

import MindmapVM from 'src/ui/viewmodels/Mindmap';
import MainVM from 'src/ui/viewmodels/Main';
import Patch from 'state/Patch';

import mutate from 'src/state/mutator/vm';

describe('vm', () => {

    describe(`'init' mutation`, () => {

        it('should init vm', async() => {

            // setup
            const state = createState();
            state.vm.main = undefined;

            const mainVM = new MainVM();
            mainVM.mindmap = new MindmapVM();

            const patch = new Patch('init', {
                vm: {
                    main: mainVM
                }
            });

            // target
            const result = await mutate(state, patch);

            // check
            expect(result.main).to.exist;
        });

    });

});