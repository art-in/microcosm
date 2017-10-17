import {spy} from 'sinon';
import {expect} from 'test/utils';

import Store from 'utils/state/Store';
import Handler from 'utils/state/Handler';
import {connect} from 'src/vm/utils/store-connect';
import updateObject from 'utils/update-object';

import Graph from 'src/vm/map/entities/Graph';
import Node from 'src/vm/map/entities/Node';
import LookupSuggestion from 'src/vm/shared/LookupSuggestion';
import Point from 'src/vm/shared/Point';

const mutator = () => {};

describe('Graph', () => {

    it('should have correct constructor display name', () => {

        // setup
        const graph = new Graph();

        // check
        expect(graph.constructor.displayName).to.equal('Graph(Connected)');

    });

    it(`should dispatch 'set-idea-value' action on node title change`, () => {

        // setup
        const store = new Store(new Handler(), mutator);
        const dispatch = store.dispatch = spy();

        connect.to(store);

        const graph = new Graph();

        graph.nodes = [new Node({id: 'id'})];

        // target
        graph.nodes[0].onTitleChange('title');

        // check
        expect(dispatch.callCount).to.equal(1);
        expect(dispatch.firstCall.args).to.containSubset([{
            type: 'set-idea-value',
            data: {
                ideaId: 'id',
                value: 'title'
            }}]);
    });

    it(`should dispatch action on phrase change ` +
        `in association tails lookup`, async () => {
        
        // setup
        const store = new Store(new Handler(), mutator);
        const dispatch = store.dispatch = spy();

        connect.to(store);

        const graph = new Graph();

        graph.associationTailsLookup.popup.on('change', spy());

        updateObject(graph.associationTailsLookup, {

            popup: {
                pos: new Point(0, 0)
            },
            onSelectAction: () => {},
            onPhraseChangeAction: ({phrase}) => ({
                type: 'action',
                data: {phrase}
            })
        });

        // target
        await graph.associationTailsLookup.emit(
            'phrase-changed', {
                phrase: 'test'
            });

        // check
        expect(dispatch.callCount).to.equal(1);
        expect(dispatch.firstCall.args).to.containSubset([{
            type: 'action',
            data: {phrase: 'test'}
        }]);
    });

    it(`should dispatch action on suggestion ` +
        `selected in association tails lookup`, async () => {

        // setup
        const store = new Store(new Handler(), mutator);
        const dispatch = store.dispatch = spy();

        connect.to(store);

        const graph = new Graph();

        graph.associationTailsLookup.popup.on('change', spy());

        updateObject(graph.associationTailsLookup, {
            popup: {
                pos: new Point(0, 0)
            },
            onSelectAction: ({suggestion}) => ({
                type: 'action',
                data: {ideaId: suggestion.data.ideaId}
            }),
            onPhraseChangeAction: () => {}
        });

        // target
        await graph.associationTailsLookup.emit(
            'suggestion-selected', {
                suggestion: new LookupSuggestion({
                    displayName: '',
                    data: {ideaId: 'tail'}
                })
            });

        // check
        expect(dispatch.callCount).to.equal(1);
        expect(dispatch.firstCall.args).to.containSubset([{
            type: 'action',
            data: {ideaId: 'tail'}
        }]);
    });

});