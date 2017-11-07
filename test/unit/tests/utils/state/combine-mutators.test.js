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
            _id: 'parent',
            isRoot: true,
            pos: {x: 0, y: 0}
        });

        // setup model
        const rootIdea = new Idea({
            id: 'parent',
            isRoot: true,
            rootPathWeight: 0,
            pos: new Point({x: 0, y: 0})
        });

        rootIdea.linkFromParent = null;
        rootIdea.linksToChilds = [];

        state.model.mindmap.root = rootIdea;
        state.model.mindmap.ideas.set(rootIdea.id, rootIdea);
        
        state.model.mindmap.scale = 1;

        // setup view
        ReactDom.render(
            <Provider dispatch={state.view.storeDispatch}>
                <MainView vm={state.vm.main} />
            </Provider>,
            state.view.root);

        // setup patch
        const patch = new Patch();

        patch.push({
            type: 'add-association',
            data: {
                assoc: new Association({
                    id: 'assoc',
                    fromId: 'parent',
                    toId: 'child',
                    weight: 1
                })
            }});

        patch.push({
            type: 'add-idea',
            data: {
                idea: new Idea({
                    id: 'child',
                    pos: new Point({x: 0, y: 1})
                })
            }});

        // target
        const mutate = combine([
            mutateData,
            mutateModel,
            mutateVM,
            mutateView
        ]);

        await mutate(state, patch);
    });

    it('should mutate data layer', async () => {
        
        const {data} = state;
        
        expect((await data.ideas.allDocs()).rows).to.have.length(2);
        expect((await data.associations.allDocs()).rows).to.have.length(1);
    });

    it('should mutate model layer', async () => {

        const {model} = state;
        const ideas = values(model.mindmap.ideas);
        const assocs = values(model.mindmap.associations);
        
        expect(ideas).to.have.length(2);
        expect(assocs).to.have.length(1);
    });

    it('should mutate viewmodel layer', async () => {
        
        const {vm} = state;
        const rootNode = vm.main.mindmap.graph.root;

        expect(rootNode.linksIn).to.have.length(0);
        expect(rootNode.linksOut).to.have.length(1);

        expect(rootNode).to.containSubset({
            id: 'parent',
            linksOut: [{
                id: 'assoc',
                from: {
                    id: 'parent'
                },
                to: {
                    id: 'child'
                }
            }]
        });
    });

    it('should mutate view layer', async () => {
        
        const {view} = state;
        
        expect(view.root.querySelectorAll('.Node-root')).to.have.length(2);
        expect(view.root.querySelectorAll('.Link-root')).to.have.length(1);
    });

});