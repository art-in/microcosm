import {expect} from 'test/utils';

import Point from 'src/vm/shared/Point';
import LookupSuggestion from 'src/vm/shared/LookupSuggestion';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('show-association-tails-lookup', () => {
    
    it('should hide context menu', async () => {

        // target
        const patch = await handle(null, {
            type: 'show-association-tails-lookup',
            data: {
                pos: new Point(0, 0),
                headIdeaId: 'idea'
            }});

        // check
        expect(patch).to.have.length(2);
        expect(patch[0].type).to.equal('hide-context-menu');
    });

    it('should show lookup in certain position', async () => {
        
        // target
        const patch = await handle(null, {
            type: 'show-association-tails-lookup',
            data: {
                pos: new Point(100, 200),
                headIdeaId: 'idea'
            }});

        // check
        expect(patch).to.have.length(2);
        const {type, data} = patch[1];

        expect(type).to.equal('show-association-tails-lookup');
        expect(data.pos).to.containSubset({
            x: 100,
            y: 200
        });
    });

    it(`should set on select 'create-cross-association' action`, async () => {

        // setup
        const patch = await handle(null, {
            type: 'show-association-tails-lookup',
            data: {
                pos: new Point(100, 200),
                headIdeaId: 'head idea'
            }});

        const {data: {onSelectAction}} = patch[1];

        // target
        const action = onSelectAction({
            suggestion: new LookupSuggestion({
                displayName: 'idea',
                data: {ideaId: 'tail idea'}
            })
        });
        
        // check
        expect(action).to.containSubset({
            type: 'create-cross-association',
            data: {
                headIdeaId: 'head idea',
                tailIdeaId: 'tail idea'
            }});
    });

    it(`should set on phrase change ` +
        `'search-association-tails-for-lookup' action`, async () => {
        
        // setup
        const patch = await handle(null, {
            type: 'show-association-tails-lookup',
            data: {
                pos: new Point(100, 200),
                headIdeaId: 'head idea'
            }});

        const {data: {onPhraseChangeAction}} = patch[1];

        // target
        const action = onPhraseChangeAction({
            phrase: 'phrase'
        });
        
        // check
        expect(action).to.containSubset({
            type: 'search-association-tails-for-lookup',
            data: {
                headIdeaId: 'head idea',
                phrase: 'phrase'
            }
        });
    });

    it('should target only vm and view state layers', async () => {
        
        // target
        const patch = await handle(null, {
            type: 'show-association-tails-lookup',
            data: {
                pos: new Point(100, 200),
                headIdeaId: 'idea'
            }});

        // check
        expect(patch.hasTarget('data')).to.be.false;
        expect(patch.hasTarget('model')).to.be.false;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });

});