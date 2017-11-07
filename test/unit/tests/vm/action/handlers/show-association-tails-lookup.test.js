import {expect} from 'test/utils';

import Point from 'src/model/entities/Point';
import LookupSuggestion from 'src/vm/shared/LookupSuggestion';

import handler from 'src/vm/action/handler';
const handle = handler.handle.bind(handler);

describe('show-association-tails-lookup', () => {
    
    it('should hide context menu', () => {

        // target
        const patch = handle(null, {
            type: 'show-association-tails-lookup',
            data: {
                pos: new Point({x: 0, y: 0}),
                headIdeaId: 'idea'
            }});

        // check
        expect(patch['update-context-menu']).to.have.length(1);
        expect(patch['update-context-menu'][0].data).to.deep.equal({
            popup: {active: false}
        });
    });

    it('should show lookup in certain position', () => {
        
        // target
        const patch = handle(null, {
            type: 'show-association-tails-lookup',
            data: {
                pos: new Point({x: 100, y: 200}),
                headIdeaId: 'idea'
            }});

        // check
        const lookupMutations = patch['update-association-tails-lookup'];
        expect(lookupMutations).to.have.length(1);

        expect(lookupMutations[0].data).to.containSubset({
            popup: {
                active: true,
                pos: {
                    x: 100,
                    y: 200
                }
            }
        });
    });

    it(`should set on-select action getter`, () => {

        // setup
        const patch = handle(null, {
            type: 'show-association-tails-lookup',
            data: {
                pos: new Point({x: 100, y: 200}),
                headIdeaId: 'head idea'
            }});

        const lookupMutation = patch['update-association-tails-lookup'][0];
        const {data: {lookup: {onSelectAction}}} = lookupMutation;

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

    it(`should set on-phrase-change action getter`, () => {
        
        // setup
        const patch = handle(null, {
            type: 'show-association-tails-lookup',
            data: {
                pos: new Point({x: 100, y: 200}),
                headIdeaId: 'head idea'
            }});

        const lookupMutation = patch['update-association-tails-lookup'][0];
        const {data: {lookup: {onPhraseChangeAction}}} = lookupMutation;

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

    it('should target only vm and view state layers', () => {
        
        // target
        const patch = handle(null, {
            type: 'show-association-tails-lookup',
            data: {
                pos: new Point({x: 100, y: 200}),
                headIdeaId: 'idea'
            }});

        // check
        expect(patch.hasTarget('data')).to.be.false;
        expect(patch.hasTarget('model')).to.be.false;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });

});