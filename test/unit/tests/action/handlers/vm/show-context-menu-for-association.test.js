import {expect} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import Point from 'src/vm/shared/Point';
import MenuItem from 'src/vm/shared/MenuItem';

import dispatcher from 'src/action/dispatcher';
const dispatch = dispatcher.dispatch.bind(dispatcher);

describe('show-context-menu-for-association', () => {

    it('should show context menu with certain items', async () => {
        
        // setup
        const assoc = new Association({id: 'assoc'});
        const mindmap = new Mindmap();
        mindmap.associations.set(assoc.id, assoc);
        const state = {model: {mindmap}};

        // target
        const patch = await dispatch(
            'show-context-menu-for-association', {
                pos: new Point(0, 0),
                associationId: 'assoc',
                shaded: false
            }, state);

        // check
        expect(patch).to.have.length(1);
        const {type, data} = patch[0];

        expect(type).to.equal('show-context-menu');
        expect(data.menuItems).to.have.length(1);
        
        expect(data.menuItems.every(i => i instanceof MenuItem)).to.be.ok;
        expect(data.menuItems).to.containSubset([{
            displayValue: 'set color'
        }]);
    });

    it('should show context menu in certain position', async () => {
        
        // setup
        const assoc = new Association({id: 'assoc'});
        const mindmap = new Mindmap();
        mindmap.associations.set(assoc.id, assoc);
        const state = {model: {mindmap}};

        // target
        const patch = await dispatch(
            'show-context-menu-for-association', {
                pos: new Point(100, 200),
                associationId: 'assoc',
                shaded: false
            }, state);

        // check
        expect(patch).to.have.length(1);
        const {data} = patch[0];

        expect(data.pos).to.be.instanceOf(Point);
        expect(data.pos).to.containSubset({
            x: 100,
            y: 200
        });
    });

    it(`should set item which creates ` +
        `'show-color-picker-for-idea' action`, async () => {

        // setup
        const tailIdea = new Idea({id: 'idea'});
        const assoc = new Association({id: 'assoc'});
        assoc.toId = tailIdea.id;
        assoc.to = tailIdea;

        const mindmap = new Mindmap();
        mindmap.associations.set(assoc.id, assoc);
        const state = {model: {mindmap}};

        const patch = await dispatch(
            'show-context-menu-for-association', {
                pos: new Point(0, 0),
                associationId: 'assoc',
                shaded: false
            }, state);

        const item = patch[0].data.menuItems
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

    it('should NOT set menu if target association is shaded', async () => {

        // setup
        const assoc = new Association({id: 'assoc'});
        const mindmap = new Mindmap();
        mindmap.associations.set(assoc.id, assoc);
        const state = {model: {mindmap}};

        // target
        const patch = await dispatch(
            'show-context-menu-for-association', {
                pos: new Point(0, 0),
                associationId: 'assoc',
                shaded: true
            }, state);

        // check
        expect(patch).to.have.length(0);
    });

    it('should target only vm and view state layers', async () => {
        
        // setup
        const assoc = new Association({id: 'assoc'});
        const mindmap = new Mindmap();
        mindmap.associations.set(assoc.id, assoc);
        const state = {model: {mindmap}};

        // target
        const patch = await dispatch(
            'show-context-menu-for-association', {
                pos: new Point(0, 0),
                associationId: 'assoc',
                shaded: false
            }, state);

        // check
        expect(patch.hasTarget('data')).to.be.false;
        expect(patch.hasTarget('model')).to.be.false;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });

});