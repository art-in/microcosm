import {expect, createState} from 'test/utils';

import MindmapVM from 'src/vm/main/Mindmap';
import MainVM from 'src/vm/main/Main';
import Patch from 'utils/state/Patch';

import mutate from 'vm/mutators';

describe(`'init' mutation`, () => {

    it('should init vm', async () => {

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
        expect(result.vm.main).to.exist;
    });

});