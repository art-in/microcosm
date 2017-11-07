import {expect} from 'test/utils';

import Point from 'src/model/entities/Point';
import MenuItem from 'src/vm/shared/MenuItem';

import handler from 'src/vm/action/handler';
const handle = handler.handle.bind(handler);

describe('show-context-menu-for-idea', () => {

    it('should show context menu with certain items', () => {

        // target
        const patch = handle(null, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point({x: 0, y: 0}),
                ideaId: 'idea',
                shaded: false
            }});

        // check
        expect(patch).to.have.length(1);
        const {data} = patch['update-context-menu'][0];

        expect(data.menu.items).to.have.length(4);
        expect(data.menu.items.every(i => i instanceof MenuItem)).to.be.ok;
        expect(data.menu.items).to.containSubset([{
            displayValue: 'add idea'
        }, {
            displayValue: 'set color'
        }, {
            displayValue: 'add-association'
        }, {
            displayValue: 'remove-idea'
        }]);
    });

    it('should show context menu popup in certain position', () => {

        // target
        const patch = handle(null, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point({x: 100, y: 200}),
                ideaId: 'idea',
                shaded: false
            }});

        // check
        const {data} = patch['update-context-menu'][0];

        expect(data.popup.pos).to.be.instanceOf(Point);
        expect(data.popup.pos).to.containSubset({
            x: 100,
            y: 200
        });
    });

    it(`should set item which creates 'create-idea' action`, () => {

        // setup
        const patch = handle(null, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point({x: 0, y: 0}),
                ideaId: 'idea',
                shaded: false
            }});

        const menuMutation = patch['update-context-menu'][0];
        const item = menuMutation.data.menu.items
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
        `'show-color-picker-for-idea' action`, () => {

        // target
        const patch = handle(null, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point({x: 0, y: 0}),
                ideaId: 'idea',
                shaded: false
            }
        });

        const menuMutation = patch['update-context-menu'][0];
        const item = menuMutation.data.menu.items
            .find(i => i.displayValue === 'set color');
            
        // target
        const action = item.onSelectAction();

        // check
        expect(action).to.containSubset({
            type: 'show-color-picker-for-idea',
            data: {
                ideaId: 'idea'
            }
        });
    });

    it(`should set item which creates ` +
        `'show-association-tails-lookup' action`, () => {
        
        // setup
        const patch = handle(null, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point({x: 100, y: 200}),
                ideaId: 'idea',
                shaded: false
            }});

        const menuMutation = patch['update-context-menu'][0];
        const item = menuMutation.data.menu.items
            .find(i => i.displayValue === 'add-association');

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

    it(`should set item which creates 'remove-idea' action`, () => {
    
        // setup
        const patch = handle(null, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point({x: 100, y: 200}),
                ideaId: 'idea',
                shaded: false
            }});

        const menuMutation = patch['update-context-menu'][0];
        const item = menuMutation.data.menu.items
            .find(i => i.displayValue === 'remove-idea');

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

    it('should NOT show menu if target idea is shaded', () => {

        // target
        const patch = handle(null, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point({x: 0, y: 0}),
                ideaId: 'idea',
                shaded: true
            }});

        // check
        expect(patch).to.have.length(0);
    });

    it('should target only vm and view state layers', () => {
        
        // target
        const patch = handle(null, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point({x: 0, y: 0}),
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