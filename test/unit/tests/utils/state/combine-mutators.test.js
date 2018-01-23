import {expect, createState} from 'test/utils';

import combine from 'src/utils/state/combine-mutators';

import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';
import Point from 'src/model/entities/Point';
import Patch from 'src/utils/state/Patch';

import values from 'src/utils/get-map-values';

import mutateData from 'src/data/mutators';
import mutateModel from 'src/model/mutators';
import mutateVM from 'src/vm/mutators';
import mutateView from 'src/view/mutators';

import React from 'react';
import ReactDom from 'react-dom';
import Provider from 'view/utils/connect/Provider';
import MainView from 'src/view/main/Main';

describe('combine-mutators', () => {
  let state;
  beforeEach(async () => {
    // setup
    state = createState();

    // setup data
    await state.data.ideas.put({
      _id: 'A',
      isRoot: true,
      posRel: {x: 0, y: 0},
      title: 'A title'
    });

    // setup model
    const ideaA = new Idea({
      id: 'A',
      isRoot: true,
      rootPathWeight: 0,
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      title: 'A title'
    });

    ideaA.edgeFromParent = null;
    ideaA.edgesToChilds = [];

    state.model.mindset.root = ideaA;
    state.model.mindset.ideas.set(ideaA.id, ideaA);

    state.model.mindset.scale = 1;

    // setup view
    ReactDom.render(
      <Provider dispatch={state.view.storeDispatch}>
        <MainView main={state.vm.main} />
      </Provider>,
      state.view.root
    );

    // setup patch
    const patch = new Patch();

    const ideaB = new Idea({
      id: 'B',
      mindsetId: 'mindset id',
      isRoot: true,
      rootPathWeight: 0,
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      title: 'B title'
    });

    const assocAtoB = new Association({
      id: 'A to B',
      mindsetId: 'mindset id',
      fromId: ideaA.id,
      from: ideaA,
      toId: ideaB.id,
      to: ideaB,
      weight: 1
    });

    ideaB.edgesIn = [assocAtoB];
    ideaB.edgeFromParent = assocAtoB;

    patch.push({
      type: 'add-idea',
      data: {
        idea: ideaB
      }
    });

    patch.push({
      type: 'add-association',
      data: {assoc: assocAtoB}
    });

    patch.push({
      type: 'update-idea',
      data: {
        id: ideaA.id,
        edgesOut: [assocAtoB],
        edgesToChilds: [assocAtoB]
      }
    });

    // target
    const mutate = combine([mutateData, mutateModel, mutateVM, mutateView]);

    await mutate(state, patch);
  });

  it('should mutate data layer', async () => {
    const {data} = state;

    expect((await data.ideas.allDocs()).rows).to.have.length(2);
    expect((await data.associations.allDocs()).rows).to.have.length(1);
  });

  it('should mutate model layer', async () => {
    const {model} = state;
    const ideas = values(model.mindset.ideas);
    const assocs = values(model.mindset.associations);

    expect(ideas).to.have.length(2);
    expect(assocs).to.have.length(1);
  });

  it('should mutate viewmodel layer', async () => {
    const {vm} = state;
    const nodeA = vm.main.mindset.mindmap.root;

    expect(nodeA.edgesIn).to.have.length(0);
    expect(nodeA.edgesOut).to.have.length(1);

    expect(nodeA).to.containSubset({
      id: 'A',
      edgesOut: [
        {
          id: 'A to B',
          from: {
            id: 'A'
          },
          to: {
            id: 'B'
          }
        }
      ]
    });
  });

  it('should mutate view layer', async () => {
    const {view} = state;

    expect(view.root.querySelectorAll('.Node-root')).to.have.length(2);
    expect(view.root.querySelectorAll('.Link-root')).to.have.length(1);
  });
});
