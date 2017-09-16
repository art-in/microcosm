import sinon from 'sinon';
import {expect} from 'test/utils';

import Store from 'utils/state/Store';
import Dispatcher from 'utils/state/Dispatcher';
import {connect} from 'src/vm/utils/store-connect';

import Graph from 'src/vm/map/entities/Graph';
import Node from 'src/vm/map/entities/Node';

const mutator = () => {};

describe('Graph', () => {

    it('should have correct constructor display name', () => {

        // setup
        connect.to(new Store(new Dispatcher(), mutator));
        const graph = new Graph();

        // check
        expect(graph.constructor.displayName).to.equal('Graph(Connected)');

    });

    it(`should dispatch 'set-idea-value' on node title change`, () => {

        // setup
        const store = new Store(new Dispatcher(), mutator);
        const dispatch = store.dispatch = sinon.spy();

        connect.to(store);

        const graph = new Graph();

        graph.nodes = [new Node({id: 'id'})];

        // target
        graph.nodes[0].onTitleChange('title');

        // check
        expect(dispatch.callCount).to.equal(1);
        expect(dispatch.firstCall.args).to.deep.equal([
            'set-idea-value', {
                ideaId: 'id',
                value: 'title'
            }
        ]);
    });

});