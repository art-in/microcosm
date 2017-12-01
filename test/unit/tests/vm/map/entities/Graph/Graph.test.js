import {expect} from 'test/utils';

import Graph from 'src/vm/map/entities/Graph';

describe('Graph', () => {

    require('./methods');

    it('should have correct constructor display name', () => {

        // setup
        const graph = new Graph();

        // check

        // @ts-ignore ViewModel incorrectly extends EventEmitter
        expect(graph.constructor.displayName).to.equal('Graph');

    });

});