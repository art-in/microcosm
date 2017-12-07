import {expect} from 'test/utils';
import createState from 'test/utils/create-state';

import Point from 'src/model/entities/Point';
import MenuItem from 'src/vm/shared/MenuItem';
import Idea from 'src/model/entities/Idea';
import Node from 'src/vm/map/entities/Node';

import handler from 'src/vm/action/handler';
const handle = handler.handle.bind(handler);

describe('show-context-menu-for-idea', () => {

    it('should show context menu with certain items', () => {

        // setup
        const state = createState();

        const idea = new Idea({id: 'idea'});
        state.model.mindmap.ideas.set(idea.id, idea);

        const node = new Node({id: idea.id});
        state.vm.main.mindmap.graph.nodes.push(node);

        // target
        const patch = handle(state, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point({x: 0, y: 0}),
                ideaId: 'idea'
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

        // setup
        const state = createState();
        
        const idea = new Idea({id: 'idea'});
        state.model.mindmap.ideas.set(idea.id, idea);

        const node = new Node({id: idea.id});
        state.vm.main.mindmap.graph.nodes.push(node);

        // target
        const patch = handle(state, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point({x: 100, y: 200}),
                ideaId: 'idea'
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
        const state = createState();
        
        const idea = new Idea({id: 'idea'});
        state.model.mindmap.ideas.set(idea.id, idea);

        const node = new Node({id: idea.id});
        state.vm.main.mindmap.graph.nodes.push(node);

        // setup patch
        const patch = handle(state, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point({x: 0, y: 0}),
                ideaId: 'idea'
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

        // setup
        const state = createState();
        
        const idea = new Idea({id: 'idea'});
        state.model.mindmap.ideas.set(idea.id, idea);

        const node = new Node({id: idea.id});
        state.vm.main.mindmap.graph.nodes.push(node);

        // target
        const patch = handle(state, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point({x: 0, y: 0}),
                ideaId: 'idea'
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
        const state = createState();
        
        const idea = new Idea({id: 'idea'});
        state.model.mindmap.ideas.set(idea.id, idea);

        const node = new Node({id: idea.id});
        state.vm.main.mindmap.graph.nodes.push(node);

        // setup
        const patch = handle(state, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point({x: 100, y: 200}),
                ideaId: 'idea'
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
        const state = createState();
        
        const idea = new Idea({id: 'idea'});
        state.model.mindmap.ideas.set(idea.id, idea);

        const node = new Node({id: idea.id});
        state.vm.main.mindmap.graph.nodes.push(node);

        // setup patch
        const patch = handle(state, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point({x: 100, y: 200}),
                ideaId: 'idea'
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

        // setup
        const state = createState();
        
        const idea = new Idea({id: 'idea'});
        state.model.mindmap.ideas.set(idea.id, idea);

        const node = new Node({id: idea.id, shaded: true});
        state.vm.main.mindmap.graph.nodes.push(node);

        // target
        const patch = handle(state, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point({x: 0, y: 0}),
                ideaId: 'idea'
            }});

        // check
        expect(patch).to.have.length(0);
    });

    it('should target only vm and view state layers', () => {
        
        // setup
        const state = createState();
        
        const idea = new Idea({id: 'idea'});
        state.model.mindmap.ideas.set(idea.id, idea);

        const node = new Node({id: idea.id});
        state.vm.main.mindmap.graph.nodes.push(node);

        // target
        const patch = handle(state, {
            type: 'show-context-menu-for-idea',
            data: {
                pos: new Point({x: 0, y: 0}),
                ideaId: 'idea'
            }});

        // check
        expect(patch.hasTarget('data')).to.be.false;
        expect(patch.hasTarget('model')).to.be.false;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });

});