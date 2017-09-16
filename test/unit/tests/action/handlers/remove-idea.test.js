import {expect} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import dispatcher from 'src/action/dispatcher';
const dispatch = dispatcher.dispatch.bind(dispatcher);

describe(`'remove-idea' action`, () => {
    
    it('should remove idea', async () => {

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
        const patch = await dispatch('remove-idea', {
            ideaId: 'die'
        }, state);

        // check
        expect(patch).to.have.length(2);
        expect(patch['remove idea'][0]).to.deep.equal({id: 'die'});
    });

    it('should remove incoming associations', async () => {

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
        const patch = await dispatch('remove-idea', {
            ideaId: 'die'
        }, state);

        // check
        expect(patch).to.have.length(3);

        expect(patch['remove idea'][0]).to.deep.equal({id: 'die'});
        expect(patch['remove association'][0]).to.deep.equal({id: 'a'});
        expect(patch['remove association'][1]).to.deep.equal({id: 'b'});
    });

    it('should remove idea before associations', async () => {
        
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
        const patch = await dispatch('remove-idea', {
            ideaId: 'die'
        }, state);

        // check
        const mutations = [...patch];
        expect(mutations).to.have.length(2);

        expect(mutations[0].type).to.equal('remove idea');
        expect(mutations[1].type).to.equal('remove association');
    });

    it('should fail if outgoing associations exist', async () => {

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
        const promise = dispatch('remove-idea', {
            ideaId: 'die'
        }, state);

        // check
        await expect(promise).to.be.rejectedWith(
            `Unable to remove idea 'die' with outgoing associations`);
    });

    it('should fail if no incoming associations found', async () => {
        
        // setup
        const mindmap = new Mindmap();

        mindmap.ideas.set('live', new Idea({id: 'live'}));
        mindmap.ideas.set('die', new Idea({id: 'die'}));

        const state = {model: {mindmap}};

        // target
        const promise = dispatch('remove-idea', {
            ideaId: 'die'
        }, state);

        // check
        await expect(promise).to.be.rejectedWith(
            `No incoming associations found for idea 'die'`);
    });

    it('should fail if idea not found', async () => {

        // setup
        const mindmap = new Mindmap();

        const state = {model: {mindmap}};

        // target
        const promise = dispatch('remove-idea', {
            ideaId: 'uknown'
        }, state);

        // check
        await expect(promise).to.be.rejectedWith(
            'Idea with ID \'uknown\' not found in mindmap');
    });

    it('should fail if idea is root', async () => {

        // setup
        const mindmap = new Mindmap();

        mindmap.ideas.set('root',
            new Idea({id: 'root', isRoot: true}));

        const state = {model: {mindmap}};

        // target
        const promise = dispatch('remove-idea', {
            ideaId: 'root'
        }, state);

        // check
        await expect(promise).to.be.rejectedWith(
            'Unable to remove root idea');
    });

});