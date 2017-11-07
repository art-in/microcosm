import {expect} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('remove-idea', () => {
    
    it('should remove idea', () => {

        // setup
        const mindmap = new Mindmap();

        const ideaLive = new Idea({id: 'live'});
        const ideaDie = new Idea({id: 'die'});

        const assoc = new Association({fromId: 'live', toId: 'die'});

        ideaLive.associationsOut = [assoc];
        ideaDie.associationsIn = [assoc];

        mindmap.ideas.set('live', ideaLive);
        mindmap.ideas.set('die', ideaDie);
        mindmap.associations.set(assoc.id, assoc);

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'remove-idea',
            data: {ideaId: 'die'}
        });

        // check
        expect(patch).to.have.length(2);

        const mutation = patch['remove-idea'][0];
        expect(mutation.data).to.deep.equal({id: 'die'});
    });

    it('should remove incoming associations', () => {

        // setup
        //
        // (live 1) --a--→ (die)
        // (live 2) --b--↗
        //
        const ideaLive1 = new Idea({id: 'live 1'});
        const ideaLive2 = new Idea({id: 'live 2'});
        const ideaDie = new Idea({id: 'die'});

        const assocA = new Association({
            id: 'a',
            fromId: ideaLive1.id,
            from: ideaLive1,
            toId: ideaDie.id,
            to: ideaDie
        });

        const assocB = new Association({
            id: 'b',
            fromId: ideaLive2.id,
            from: ideaLive2,
            toId: ideaDie.id,
            to: ideaDie
        });

        ideaLive1.associationsOut = [assocA];
        ideaLive2.associationsOut = [assocB];
        ideaDie.associationsIn = [assocA, assocB];

        const mindmap = new Mindmap();

        mindmap.associations.set(assocA.id, assocA);
        mindmap.associations.set(assocB.id, assocB);

        mindmap.ideas.set(ideaLive1.id, ideaLive1);
        mindmap.ideas.set(ideaLive2.id, ideaLive2);
        mindmap.ideas.set(ideaDie.id, ideaDie);

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'remove-idea',
            data: {ideaId: 'die'}
        });

        // check
        expect(patch).to.have.length(3);

        expect(patch['remove-idea'][0].data).to.deep.equal({id: 'die'});
        expect(patch['remove-association'][0].data).to.deep.equal({id: 'a'});
        expect(patch['remove-association'][1].data).to.deep.equal({id: 'b'});
    });

    it('should remove idea before associations', () => {
        
        // setup
        const mindmap = new Mindmap();

        const ideaLive = new Idea({id: 'live'});
        const ideaDie = new Idea({id: 'die'});

        const assoc = new Association({fromId: 'live', toId: 'die'});

        ideaLive.associationsOut = [assoc];
        ideaDie.associationsIn = [assoc];

        mindmap.ideas.set('live', ideaLive);
        mindmap.ideas.set('die', ideaDie);
        mindmap.associations.set(assoc.id, assoc);

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'remove-idea',
            data: {ideaId: 'die'}
        });

        // check
        const mutations = [...patch];
        expect(mutations).to.have.length(2);

        expect(mutations[0].type).to.equal('remove-idea');
        expect(mutations[1].type).to.equal('remove-association');
    });

    it('should target all state layers', () => {

        // setup
        const mindmap = new Mindmap();
        
        const ideaLive = new Idea({id: 'live'});
        const ideaDie = new Idea({id: 'die'});

        const assoc = new Association({fromId: 'live', toId: 'die'});

        ideaLive.associationsOut = [assoc];
        ideaDie.associationsIn = [assoc];

        mindmap.ideas.set('live', ideaLive);
        mindmap.ideas.set('die', ideaDie);
        mindmap.associations.set(assoc.id, assoc);

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'remove-idea',
            data: {ideaId: 'die'}
        });

        // check
        expect(patch.hasTarget('data')).to.be.true;
        expect(patch.hasTarget('model')).to.be.true;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });

    it('should fail if outgoing associations exist', () => {

        // setup
        const mindmap = new Mindmap();

        // [live 1] --a--> [die] --b--> [live 2]
        const ideaLive1 = new Idea({id: 'live 1'});
        const ideaDie = new Idea({id: 'die'});
        const ideaLive2 = new Idea({id: 'live 2'});

        mindmap.ideas.set(ideaLive1.id, ideaLive1);
        mindmap.ideas.set(ideaDie.id, ideaDie);
        mindmap.ideas.set(ideaLive2.id, ideaLive2);

        const assocLive = new Association({
            fromId: 'live 1',
            toId: 'die'
        });

        const assocDie = new Association({
            fromId: 'die',
            toId: 'live 2'
        });

        ideaLive1.associationsOut = [assocLive];
        ideaDie.associationsOut = [assocDie];
        ideaLive2.associationsOut = [];

        mindmap.associations.set(assocLive.id, assocLive);
        mindmap.associations.set(assocDie.id, assocDie);

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'remove-idea',
            data: {ideaId: 'die'}
        });

        // check
        expect(result).to.throw(
            `Unable to remove idea 'die' with outgoing associations`);
    });

    it('should fail if no incoming associations found', () => {
        
        // setup
        const mindmap = new Mindmap();

        mindmap.ideas.set('live', new Idea({id: 'live'}));
        mindmap.ideas.set('die', new Idea({id: 'die'}));

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'remove-idea',
            data: {ideaId: 'die'}
        });

        // check
        expect(result).to.throw(
            `No incoming associations found for idea 'die'`);
    });

    it('should fail if idea not found', () => {

        // setup
        const mindmap = new Mindmap();

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'remove-idea',
            data: {ideaId: 'uknown'}
        });

        // check
        expect(result).to.throw(
            'Idea \'uknown\' was not found in mindmap');
    });

    it('should fail if idea is root', () => {

        // setup
        const mindmap = new Mindmap();

        mindmap.ideas.set('root',
            new Idea({id: 'root', isRoot: true}));

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'remove-idea',
            data: {ideaId: 'root'}
        });

        // check
        expect(result).to.throw(
            'Unable to remove root idea');
    });

});