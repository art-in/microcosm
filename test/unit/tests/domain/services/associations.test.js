import {expect} from 'test/utils';

import dispatcher from 'src/domain/service';

import Mindmap from 'src/domain/models/Mindmap';
import Association from 'src/domain/models/Association';

const dispatch = dispatcher.dispatch.bind(dispatcher);

describe('associations', () => {

    describe(`'set-association-value' action`, () => {

        it('should set association value', async () => {

            // setup
            const mindmap = new Mindmap();

            mindmap.assocs.push(new Association({
                id: 'id',
                value: 'old'
            }));

            const state = {model: {mindmap}};

            // target
            const patch = await dispatch('set-association-value', {
                assocId: 'id',
                value: 'new'
            }, state);

            // check
            expect(patch).to.have.length(1);

            expect(patch['update association']).to.exist;
            expect(patch['update association'][0]).to.deep.equal({
                id: 'id',
                value: 'new'
            });
        });

    });

});