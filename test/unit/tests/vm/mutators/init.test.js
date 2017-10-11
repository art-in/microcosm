import {expect, createState} from 'test/utils';

import MindmapVM from 'src/vm/main/Mindmap';
import MainVM from 'src/vm/main/Main';
import Patch from 'utils/state/Patch';

import mutate from 'vm/mutators';

describe('init', () => {

    it('should init vm', () => {

        // setup
        const state = createState();
        state.vm.main = undefined;

        const mainVM = new MainVM();
        mainVM.mindmap = new MindmapVM();

        const patch = new Patch({
            type: 'init',
            data: {
                vm: {
                    main: mainVM
                }
            }
        });

        // target
        mutate(state, patch);

        // check
        expect(state.vm.main).to.exist;
    });

});