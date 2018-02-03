import {expect, createState, combinePatches} from 'test/utils';
import {spy} from 'sinon';

import Point from 'src/model/entities/Point';
import Idea from 'src/model/entities/Idea';
import PatchType from 'src/utils/state/Patch';
import MutationType from 'utils/state/Mutation';

import mutateVM from 'src/vm/mutators';
import Node from 'src/vm/map/entities/Node';
import ViewboxType from 'src/vm/map/entities/Viewbox';

import handler from 'src/vm/action/handler';
const handle = handler.handle.bind(handler);

describe('animate-mindmap-viewbox-to-idea', () => {
  describe('animating to idea', () => {
    /**
     * @typedef {object} SetupResult
     * @prop {PatchType} patch
     * @prop {ViewboxType} finalMutationViewbox
     * @prop {sinon.SinonSpy} dispatchSpy
     *
     * @return {Promise.<SetupResult>}
     */
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
      const {mindset} = state.model;

      const ideaA = new Idea({
        id: 'A',
        rootPathWeight: 500,
        posAbs: new Point({x: 500, y: 500})
      });

      mindset.ideas.set(ideaA.id, ideaA);
      mindset.root = ideaA;
      mindset.focusIdeaId = 'A';

      // setup view model
      const {mindmap} = state.vm.main.mindset;

      mindmap.viewbox.center.x = 50;
      mindmap.viewbox.center.y = 50;
      mindmap.viewbox.topLeft.x = 0;
      mindmap.viewbox.topLeft.y = 0;
      mindmap.viewbox.size.width = 100;
      mindmap.viewbox.size.height = 100;
      mindmap.viewbox.scale = 1;

      mindmap.viewport.width = 100;
      mindmap.viewport.height = 100;

      const nodeA = new Node({id: 'A'});

      mindmap.nodes.push(nodeA);

      // setup spies
      const dispatchSpy = spy();
      const mutateMock = spy(mutateVM.bind(null, state));

      // setup action
      const action = {
        type: 'animate-mindmap-viewbox-to-idea',
        data: {
          ideaId: 'A',
          scheduleAnimationStep: cb => setTimeout(cb, 50)
        }
      };

      // target
      const resPatch = await handle(state, action, dispatchSpy, mutateMock);

      // check
      const patch = combinePatches(mutateMock, resPatch);

      /** @type {Array.<MutationType>} */
      const mutations = patch['update-mindmap'];
      const vbMutations = mutations.filter(m =>
        m.data.hasOwnProperty('viewbox')
      );
      const finalVBMutation = vbMutations[vbMutations.length - 1];
      const {viewbox: finalMutationViewbox} = finalVBMutation.data;

      return {patch, finalMutationViewbox, dispatchSpy};
    }

    it('should set idea to viewbox focus zone', async () => {
      const {finalMutationViewbox: viewbox} = await setup();

      // scale of idea with RPW 500 = 0.5,
      // then viewbox should have scale 2 for target idea to be focused.
      // and if viewbox scale now 2 its size should be 2 times smaller.
      expect(viewbox.scale).to.equal(2);
      expect(viewbox.size.height).to.equal(50);
      expect(viewbox.size.width).to.equal(50);
    });

    it('should set idea to the center of viewbox', async () => {
      const {finalMutationViewbox: viewbox} = await setup();

      // viewbox center should equal to target idea position 500x500
      expect(viewbox.center.x).to.equal(500);
      expect(viewbox.center.y).to.equal(500);

      // viewbox now have size 50x50,
      // top-left corner of viewbox should be at (500 - 50/2)
      expect(viewbox.topLeft.x).to.equal(475);
      expect(viewbox.topLeft.y).to.equal(475);
    });

    it(`should dispatch 'set-mindset-focus-idea' action`, async () => {
      const {dispatchSpy} = await setup();

      expect(dispatchSpy.callCount).to.equal(1);
      expect(dispatchSpy.firstCall.args).to.have.length(1);
      expect(dispatchSpy.firstCall.args[0]).to.containSubset({
        type: 'set-mindset-focus-idea',
        data: {
          ideaId: 'A'
        }
      });
    });

    it('should progressively increase viewbox scale', async () => {
      const {patch} = await setup();

      // collect scale mutations
      const mutations = patch['update-mindmap'];
      const scales = mutations.reduce((arr, m) => {
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
      const mutations = patch['update-mindmap'];
      const positions = mutations.reduce((arr, m) => {
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

  it('should NOT animate if viewbox is already in place', async () => {
    const state = createState();

    // setup model
    const {mindset} = state.model;

    const ideaA = new Idea({
      id: 'A',
      rootPathWeight: 500,
      posAbs: new Point({x: 500, y: 500})
    });

    mindset.ideas.set(ideaA.id, ideaA);
    mindset.root = ideaA;
    mindset.focusIdeaId = 'A';

    // setup view model
    const {mindmap} = state.vm.main.mindset;

    mindmap.viewbox.center.x = 500;
    mindmap.viewbox.center.y = 500;
    mindmap.viewbox.topLeft.x = 475;
    mindmap.viewbox.topLeft.y = 475;
    mindmap.viewbox.size.width = 100;
    mindmap.viewbox.size.height = 100;
    mindmap.viewbox.scale = 2;

    mindmap.viewport.width = 100;
    mindmap.viewport.height = 100;

    const nodeA = new Node({id: 'A'});

    mindmap.nodes.push(nodeA);

    // setup spies
    const dispatchSpy = spy();
    const mutateMock = spy(mutateVM.bind(null, state));

    // setup action
    const action = {
      type: 'animate-mindmap-viewbox-to-idea',
      data: {
        ideaId: 'A',
        scheduleAnimationStep: cb => setTimeout(cb, 50)
      }
    };

    // target
    const resPatch = await handle(state, action, dispatchSpy, mutateMock);

    // check
    const patch = combinePatches(mutateMock, resPatch);

    expect(patch).to.have.length(0);
  });
});
