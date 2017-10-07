import {expect} from 'test/utils';

import Point from 'src/vm/shared/Point';
import MenuItem from 'src/vm/shared/MenuItem';

import dispatcher from 'src/action/dispatcher';
const dispatch = dispatcher.dispatch.bind(dispatcher);

describe('show-context-menu-for-idea', () => {

    it('should show context menu with certain items', async () => {

        // target
        const patch = await dispatch(null, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point(0, 0),
                ideaId: 'idea',
                shaded: false
            }});

        // check
        expect(patch).to.have.length(1);
        const {type, data} = patch[0];

        expect(type).to.equal('show-context-menu');
        expect(data.menuItems).to.have.length(3);
        
        expect(data.menuItems.every(i => i instanceof MenuItem)).to.be.ok;
        expect(data.menuItems).to.containSubset([{
            displayValue: 'add idea'
        }, {
            displayValue: 'add association'
        }, {
            displayValue: 'remove idea'
        }]);
    });

    it('should show context menu in certain position', async () => {

        // target
        const patch = await dispatch(null, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point(100, 200),
                ideaId: 'idea',
                shaded: false
            }});

        // check
        expect(patch).to.have.length(1);
        const {data} = patch[0];

        expect(data.pos).to.be.instanceOf(Point);
        expect(data.pos).to.containSubset({
            x: 100,
            y: 200
        });
    });

    it(`should set item which creates 'create-idea' action`, async () => {

        // setup
        const patch = await dispatch(null, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point(0, 0),
                ideaId: 'idea',
                shaded: false
            }});

        const item = patch[0].data.menuItems
            .find(i => i.displayValue === 'add idea');

        // target
        const action = item.onSelectAction();

        // check
        expect(action).to.containSubset({
            type: 'create-idea',
            data: {
                parentIdeaId: 'idea'
            }
        });
    });

    it(`should set item which creates ` +
        `'show-association-tails-lookup' action`, async () => {
        
        // setup
        const patch = await dispatch(null, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point(100, 200),
                ideaId: 'idea',
                shaded: false
            }});

        const item = patch[0].data.menuItems
            .find(i => i.displayValue === 'add association');

        // target
        const action = item.onSelectAction();

        // check
        expect(action).to.containSubset({
            type: 'show-association-tails-lookup',
            data: {
                pos: {x: 100, y: 200},
                headIdeaId: 'idea'
            }
        });
    });

    it(`should set item which creates 'remove-idea' action`, async () => {
    
        // setup
        const patch = await dispatch(null, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point(100, 200),
                ideaId: 'idea',
                shaded: false
            }});

        const item = patch[0].data.menuItems
            .find(i => i.displayValue === 'remove idea');

        // target
        const action = item.onSelectAction();

        // check
        expect(action).to.containSubset({
            type: 'remove-idea',
            data: {
                ideaId: 'idea'
            }
        });
    });

    it('should NOT show menu if target idea is shaded', async () => {

        // target
        const patch = await dispatch(null, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point(0, 0),
                ideaId: 'idea',
                shaded: true
            }});

        // check
        expect(patch).to.have.length(0);
    });

    it('should target only vm and view state layers', async () => {
        
        // target
        const patch = await dispatch(null, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point(0, 0),
                ideaId: 'idea',
                shaded: false
            }});

        // check
        expect(patch.hasTarget('data')).to.be.false;
        expect(patch.hasTarget('model')).to.be.false;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });

});