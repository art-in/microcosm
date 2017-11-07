import {expect} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import Point from 'src/model/entities/Point';
import MenuItem from 'src/vm/shared/MenuItem';

import handler from 'src/vm/action/handler';
const handle = handler.handle.bind(handler);

describe('show-context-menu-for-association', () => {

    it('should show context menu with certain items', () => {
        
        // setup
        const assoc = new Association({id: 'assoc'});
        assoc.to = new Idea();

        const mindmap = new Mindmap();
        mindmap.associations.set(assoc.id, assoc);
        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'show-context-menu-for-association',
            data: {
                pos: new Point({x: 0, y: 0}),
                associationId: 'assoc',
                shaded: false
            }
        });

        // check
        expect(patch).to.have.length(1);
        const {data} = patch['update-context-menu'][0];

        expect(data.popup.active).to.equal(true);

        expect(data.menu.items).to.have.length(1);
        data.menu.items.forEach(i => expect(i).to.be.instanceOf(MenuItem));
        expect(data.menu.items).to.containSubset([{
            displayValue: 'remove association'
        }]);
    });

    it('should show context menu in certain position', () => {
        
        // setup
        const assoc = new Association({id: 'assoc'});
        assoc.to = new Idea();

        const mindmap = new Mindmap();
        mindmap.associations.set(assoc.id, assoc);
        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'show-context-menu-for-association',
            data: {
                pos: new Point({x: 100, y: 200}),
                associationId: 'assoc',
                shaded: false
            }
        });

        // check
        const {data} = patch['update-context-menu'][0];

        expect(data.popup.pos).to.be.instanceOf(Point);
        expect(data.popup.pos).to.containSubset({
            x: 100,
            y: 200
        });
    });

    it('should NOT set menu if target association is shaded', () => {

        // setup
        const assoc = new Association({id: 'assoc'});
        const mindmap = new Mindmap();
        mindmap.associations.set(assoc.id, assoc);
        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'show-context-menu-for-association',
            data: {
                pos: new Point({x: 0, y: 0}),
                associationId: 'assoc',
                shaded: true
            }
        });

        // check
        expect(patch).to.have.length(0);
    });

    it('should target only vm and view state layers', () => {
        
        // setup
        const assoc = new Association({id: 'assoc'});
        assoc.to = new Idea();

        const mindmap = new Mindmap();
        mindmap.associations.set(assoc.id, assoc);
        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'show-context-menu-for-association',
            data: {
                pos: new Point({x: 0, y: 0}),
                associationId: 'assoc',
                shaded: false
            }
        });

        // check
        expect(patch.hasTarget('data')).to.be.false;
        expect(patch.hasTarget('model')).to.be.false;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });

    it(`should disable 'remove' item if last incoming association`, () => {

        // setup
        const assoc = new Association({id: 'assoc'});
        const tail = new Idea();
        tail.associationsIn = [assoc];
        assoc.to = tail;

        const mindmap = new Mindmap();
        mindmap.associations.set(assoc.id, assoc);
        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'show-context-menu-for-association',
            data: {
                pos: new Point({x: 0, y: 0}),
                associationId: 'assoc',
                shaded: false
            }
        });

        // check
        const {data} = patch['update-context-menu'][0];
        const item = data.menu.items
            .find(i => i.displayValue === 'remove association');

        expect(item).to.exist;
        expect(item.enabled).to.equal(false);
    });

});