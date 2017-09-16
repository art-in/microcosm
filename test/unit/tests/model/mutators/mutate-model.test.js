import {expect, createDB} from 'test/utils';

import mutate from 'model/mutators';

import Patch from 'utils/state/Patch';
import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import values from 'src/utils/get-map-values';

describe(`'init' mutation`, () => {

    it('should init mindmap model from db', async () => {

        // setup
        const state = {model: {mindmap: undefined}};

        const patchData = {
            data: {
                ideas: createDB(),
                associations: createDB(),
                mindmaps: createDB()
            }
        };

        await patchData.data.ideas.post({_id: 'head', isRoot: true});
        await patchData.data.ideas.post({_id: 'tail'});
        await patchData.data.associations.post({
            fromId: 'head',
            toId: 'tail'
        });
        await patchData.data.mindmaps.post({});

        const patch = new Patch('init', patchData);

        // target
        const result = await mutate(state, patch);

        // check
        const ideas = values(result.model.mindmap.ideas);
        const assocs = values(result.model.mindmap.associations);

        expect(result.model.mindmap).to.exist;
        expect(result.model.mindmap.root).to.exist;
        expect(ideas).to.have.length(2);
        expect(assocs).to.have.length(1);
    });

    it('should get mindmap with calculated ideas depths', async () => {
        
        // setup
        const state = {model: {mindmap: undefined}};

        const patchData = {
            data: {
                ideas: createDB(),
                associations: createDB(),
                mindmaps: createDB()
            }
        };

        await patchData.data.ideas.post({_id: 'head', isRoot: true});
        await patchData.data.ideas.post({_id: 'tail'});
        await patchData.data.associations.post({
            fromId: 'head',
            toId: 'tail'
        });
        await patchData.data.mindmaps.post({});

        const patch = new Patch('init', patchData);

        // target
        const result = await mutate(state, patch);

        // check
        expect(result.model.mindmap.root).to.containSubset({
            id: 'head',
            depth: 0,
            associationsOut: [{
                to: {
                    id: 'tail',
                    depth: 1
                }
            }]
        });
    });

});

describe(`'add idea' mutation`, () => {

    it('should add idea to ideas map', async () => {

        // setup
        const rootIdea = new Idea({
            id: 'root',
            isRoot: true,
            depth: 0
        });
        const assoc = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'idea 1'
        });
        rootIdea.associationsOut = [assoc];

        const mindmap = new Mindmap();
        mindmap.root = rootIdea;
        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.associations.set(assoc.id, assoc);

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add idea',
            new Idea({id: 'idea 1', value: 'test'})
        );

        // target
        const result = await mutate(state, patch);
        const ideas = values(result.model.mindmap.ideas);

        // check
        expect(ideas).to.have.length(2);
        expect(ideas[1]).to.containSubset({
            id: 'idea 1',
            value: 'test'
        });
    });

    it('should set idea to incoming associations', async () => {
        
        // setup graph
        //
        // (root) --> (idea 1) --> (idea X)
        //    |                        ^
        //    --------------------------
        //
        const rootIdea = new Idea({
            id: 'root',
            isRoot: true,
            depth: 0
        });
        const idea1 = new Idea({
            id: 'idea 1',
            depth: 1
        });

        const assoc1 = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'idea 1',
            to: idea1
        });
        const assoc2 = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'idea X'
        });
        const assoc3 = new Association({
            fromId: 'idea 1',
            from: idea1,
            toId: 'idea X'
        });
        rootIdea.associationsOut = [assoc1, assoc2];
        idea1.associationsIn = [assoc1];
        idea1.associationsOut = [assoc3];

        const mindmap = new Mindmap();
        mindmap.root = rootIdea;
        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.ideas.set(idea1.id, idea1);
        mindmap.associations.set(assoc1.id, assoc1);
        mindmap.associations.set(assoc2.id, assoc2);
        mindmap.associations.set(assoc3.id, assoc3);

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add idea',
            new Idea({id: 'idea X'})
        );

        // target
        const result = await mutate(state, patch);

        // check
        const associations = values(result.model.mindmap.associations);

        expect(associations).to.have.length(3);
        expect(associations).to.containSubset([{
            from: {id: 'root'},
            to: {id: 'idea X'}
        }, {
            from: {id: 'idea 1'},
            to: {id: 'idea X'}
        }]);
    });

    it('should set incoming associations to idea', async () => {
        
        // setup graph
        //
        // (root) --> (idea 1) --> (idea X)
        //    |                        ^
        //    --------------------------
        //
        const rootIdea = new Idea({
            id: 'root',
            isRoot: true,
            depth: 0
        });
        const idea1 = new Idea({
            id: 'idea 1',
            depth: 1
        });

        const assoc1 = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'idea 1',
            to: idea1
        });
        const assoc2 = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'idea X'
        });
        const assoc3 = new Association({
            fromId: 'idea 1',
            from: idea1,
            toId: 'idea X'
        });
        rootIdea.associationsOut = [assoc1, assoc2];
        idea1.associationsIn = [assoc1];
        idea1.associationsOut = [assoc3];

        const mindmap = new Mindmap();
        mindmap.root = rootIdea;
        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.ideas.set(idea1.id, idea1);
        mindmap.associations.set(assoc1.id, assoc1);
        mindmap.associations.set(assoc2.id, assoc2);
        mindmap.associations.set(assoc3.id, assoc3);

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add idea',
            new Idea({id: 'idea X'})
        );

        // target
        const result = await mutate(state, patch);
        const idea = result.model.mindmap.ideas.get('idea X');
        
        // check
        expect(idea.associationsIn).to.have.length(2);
        expect(idea.associationsIn).to.containSubset([{
            from: {id: 'root'},
            to: {id: 'idea X'}
        }, {
            from: {id: 'idea 1'},
            to: {id: 'idea X'}
        }]);
    });

    it('should set empty outgoing associations to idea', async () => {
        
        // setup
        const rootIdea = new Idea({
            id: 'root',
            isRoot: true,
            depth: 0
        });
        const assoc = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'idea 1'
        });
        rootIdea.associationsOut = [assoc];

        const mindmap = new Mindmap();
        mindmap.root = rootIdea;
        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.associations.set(assoc.id, assoc);

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add idea',
            new Idea({id: 'idea 1', value: 'test'})
        );

        // target
        const result = await mutate(state, patch);
        const ideas = values(result.model.mindmap.ideas);

        // check
        expect(ideas).to.have.length(2);
        expect(ideas[1].associationsOut).to.be.empty;
    });

    it('should set idea depth', async () => {
        
        // setup graph
        //
        // (root) --> (idea 1) --> (idea X)
        //    |                        ^
        //    --------------------------
        //
        const rootIdea = new Idea({
            id: 'root',
            isRoot: true,
            depth: 0
        });
        const idea1 = new Idea({
            id: 'idea 1',
            depth: 1
        });

        const assoc1 = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'idea 1',
            to: idea1
        });
        const assoc2 = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'idea X'
        });
        const assoc3 = new Association({
            fromId: 'idea 1',
            from: idea1,
            toId: 'idea X'
        });

        rootIdea.associationsOut = [assoc1, assoc2];
        idea1.associationsIn = [assoc1];
        idea1.associationsOut = [assoc3];

        const mindmap = new Mindmap();
        mindmap.root = rootIdea;
        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.ideas.set(idea1.id, idea1);
        mindmap.associations.set(assoc1.id, assoc1);
        mindmap.associations.set(assoc2.id, assoc2);
        mindmap.associations.set(assoc3.id, assoc3);

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add idea',
            new Idea({id: 'idea X'})
        );

        // target
        const result = await mutate(state, patch);
        const ideas = values(result.model.mindmap.ideas);

        // check
        expect(ideas).to.containSubset([{
            id: 'idea X',
            depth: 1
        }]);
    });

    it('should set root idea depth to zero', async () => {
        
        // setup
        const state = {model: {mindmap: new Mindmap()}};

        const patch = new Patch(
            'add idea',
            new Idea({id: 'root', isRoot: true})
        );

        // target
        const result = await mutate(state, patch);

        // check
        const ideas = values(result.model.mindmap.ideas);

        expect(ideas).to.containSubset([{
            id: 'root',
            depth: 0
        }]);
    });

    it('should fail if mindmap already has root idea', async () => {
        
        // setup
        const rootIdea = new Idea({id: 'root', isRoot: true});
        
        const mindmap = new Mindmap();
        mindmap.root = rootIdea;
        mindmap.ideas.set(rootIdea.id, rootIdea);
        
        const state = {model: {mindmap}};

        const patch = new Patch(
            'add idea',
            new Idea({id: 'root', isRoot: true})
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            'Mindmap already has root idea');
    });

    it('should fail if no incoming associations was found', async () => {
        
        // setup
        const state = {model: {mindmap: new Mindmap()}};

        const patch = new Patch(
            'add idea',
            new Idea({id: 'idea 1', value: 'test'})
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            `No incoming associations found for idea 'idea 1'`);
    });

    it('should NOT fail if no incoming association for root', async () => {
        
        // setup
        const state = {model: {mindmap: new Mindmap()}};

        const patch = new Patch(
            'add idea',
            new Idea({id: 'root', isRoot: true})
        );

        // target
        const result = await mutate(state, patch);

        // check
        const ideas = values(result.model.mindmap.ideas);

        expect(ideas).to.have.length(1);
        expect(result.model.mindmap.root).to.containSubset({
            id: 'root'
        });
    });

    it('should fail if parent idea does not have depth', async () => {
        
        // setup
        const rootIdea = new Idea({id: 'root'});
        const assoc = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'idea 1'
        });
        rootIdea.associationsOut = [assoc];

        const mindmap = new Mindmap();
        mindmap.root = rootIdea;
        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.associations.set(assoc.id, assoc);

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add idea',
            new Idea({id: 'idea 1', value: 'test'})
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            `Parent idea 'root' does not have depth`);
    });
});

describe(`'update idea' mutation`, () => {

    it('should update idea', async () => {

        // setup
        const mindmap = new Mindmap();
        
        mindmap.ideas.set('id', new Idea({
            id: 'id',
            value: 'old',
            color: 'white'
        }));

        const state = {model: {mindmap}};

        const patch = new Patch(
            'update idea',
            {id: 'id', value: 'new'}
        );

        // target
        const result = await mutate(state, patch);

        // check
        const ideas = result.model.mindmap.ideas;

        expect([...ideas]).to.have.length(1);
        expect(ideas.get('id')).to.containSubset({
            id: 'id',
            value: 'new',
            color: 'white'
        });
    });

    it('should fail if target idea was not found', async () => {

        // setup
        const state = {model: {mindmap: new Mindmap()}};
        
        const patch = new Patch(
            'update idea',
            {id: 'id', value: 'new'}
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            `Idea 'id' was not found`);
    });

});

describe(`'remove idea' mutation`, () => {

    it('should remove idea from ideas map', async () => {

        // setup graph
        //
        //         (root)
        //        /       \
        //        v       v
        //     (live) --> (die)
        //
        const mindmap = new Mindmap();
        
        const rootIdea = new Idea({id: 'root', isRoot: true});
        const ideaLive = new Idea({id: 'live'});
        const ideaDie = new Idea({id: 'die'});

        const assocRootToLive = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'live',
            to: ideaLive
        });

        const assocLiveToDie = new Association({
            fromId: 'live',
            from: ideaLive,
            toId: 'die',
            to: ideaDie
        });

        const assocRootToDie = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'die',
            to: ideaDie
        });

        rootIdea.associationsOut = [assocRootToDie, assocRootToLive];
        ideaLive.associationsOut = [assocLiveToDie];

        ideaLive.associationsIn = [assocRootToLive];
        ideaDie.associationsIn = [assocLiveToDie, assocRootToDie];

        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.ideas.set(ideaLive.id, ideaLive);
        mindmap.ideas.set(ideaDie.id, ideaDie);

        mindmap.associations.set(assocRootToLive.id, assocRootToLive);
        mindmap.associations.set(assocLiveToDie.id, assocLiveToDie);
        mindmap.associations.set(assocRootToDie.id, assocRootToDie);

        mindmap.root = rootIdea;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'remove idea',
            {id: 'die'}
        );

        // target
        const result = await mutate(state, patch);

        // check
        const ideas = values(result.model.mindmap.ideas);

        expect(ideas).to.have.length(2);
        expect(ideas).to.containSubset([
            {id: 'root'},
            {id: 'live'}
        ]);
    });

    it('should remove idea from incoming associations', async () => {

        // setup graph
        //
        //         (root)
        //        /       \
        //        v       v
        //     (live) --> (die)
        //
        const mindmap = new Mindmap();
        
        const rootIdea = new Idea({id: 'root', isRoot: true});
        const ideaLive = new Idea({id: 'live'});
        const ideaDie = new Idea({id: 'die'});

        const assocRootToLive = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'live',
            to: ideaLive
        });

        const assocLiveToDie = new Association({
            fromId: 'live',
            from: ideaLive,
            toId: 'die',
            to: ideaDie
        });

        const assocRootToDie = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'die',
            to: ideaDie
        });

        rootIdea.associationsOut = [assocRootToDie, assocRootToLive];
        ideaLive.associationsOut = [assocLiveToDie];

        ideaLive.associationsIn = [assocRootToLive];
        ideaDie.associationsIn = [assocLiveToDie, assocRootToDie];

        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.ideas.set(ideaLive.id, ideaLive);
        mindmap.ideas.set(ideaDie.id, ideaDie);

        mindmap.associations.set(assocRootToLive.id, assocRootToLive);
        mindmap.associations.set(assocLiveToDie.id, assocLiveToDie);
        mindmap.associations.set(assocRootToDie.id, assocRootToDie);

        mindmap.root = rootIdea;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'remove idea',
            {id: 'die'}
        );

        // target
        const result = await mutate(state, patch);

        // check
        const assocs = values(result.model.mindmap.associations);

        expect(assocs).to.have.length(3);
        expect(assocs).to.containSubset([{
            from: {id: 'root'},
            to: {id: 'live'}
        }, {
            from: {id: 'root'},
            toId: null,
            to: null
        }, {
            from: {id: 'live'},
            toId: null,
            to: null
        }]);
    });

    it('should fail if no incoming associations found', async () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const rootIdea = new Idea({id: 'root'});
        const ideaDie = new Idea({id: 'die'});

        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.ideas.set(ideaDie.id, ideaDie);
        mindmap.root = rootIdea;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'remove idea',
            {id: 'die'}
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            `No incoming associations found for idea 'die'`);
    });

    it('should NOT fail if no incoming associations for root', async () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const rootIdea = new Idea({id: 'root', isRoot: true});

        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.root = rootIdea;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'remove idea',
            {id: 'root'}
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.not.be.rejectedWith();
    });
});

describe(`'add association' mutation`, () => {

    it('should add association to map', async () => {

        // setup
        const mindmap = new Mindmap();
        
        const ideaHead = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = ideaHead;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add association',
            new Association({
                id: 'assoc',
                value: 'test',
                fromId: 'head',
                toId: 'tail'
            })
        );

        // target
        const result = await mutate(state, patch);
        const assocs = values(result.model.mindmap.associations);

        // check
        expect(assocs).to.have.length(1);
        expect(assocs[0]).to.containSubset({
            id: 'assoc',
            value: 'test'
        });
    });

    it('should set head idea to association', async () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add association',
            new Association({
                id: 'assoc',
                fromId: 'head',
                toId: 'tail'
            })
        );

        // target
        const result = await mutate(state, patch);
        const assocs = values(result.model.mindmap.associations);

        // check
        expect(assocs).to.have.length(1);
        expect(assocs[0]).to.containSubset({
            fromId: 'head',
            from: {id: 'head'}
        });
    });

    it('should set tail idea to association', async () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add association',
            new Association({
                id: 'assoc',
                fromId: 'head',
                toId: 'tail'
            })
        );

        // target
        const result = await mutate(state, patch);

        // check
        const assocs = values(result.model.mindmap.associations);

        expect(assocs).to.have.length(1);
        expect(assocs[0]).to.containSubset({
            toId: 'tail',
            to: {id: 'tail'}
        });
    });

    it('should set association to head idea as outgoing', async () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add association',
            new Association({
                id: 'assoc',
                fromId: 'head',
                toId: 'tail'
            })
        );

        // target
        const result = await mutate(state, patch);

        // check
        const ideas = values(result.model.mindmap.ideas);

        expect(ideas).to.have.length(2);
        expect(ideas).to.containSubset([{
            id: 'head',
            associationsOut: [{
                id: 'assoc'
            }]
        }]);
    });

    it('should set association to tail idea as incoming', async () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add association',
            new Association({
                id: 'assoc',
                fromId: 'head',
                toId: 'tail'
            })
        );

        // target
        const result = await mutate(state, patch);

        // check
        const ideas = values(result.model.mindmap.ideas);

        expect(ideas).to.have.length(2);
        expect(ideas).to.containSubset([{
            id: 'tail',
            associationsIn: [{
                id: 'assoc'
            }]
        }]);

    });

    it('should fail if head idea was not found', async () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', isRoot: true});
        const tailIdea = new Idea({id: 'tail'});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.ideas.set(tailIdea.id, tailIdea);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add association',
            new Association({
                fromId: 'XXX',
                toId: 'tail'
            })
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            `Head idea 'XXX' was not found for association`);
    });

    it('should NOT fail if tail idea was not found', async () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', isRoot: true});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add association',
            new Association({
                fromId: 'head',
                toId: 'tail'
            })
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.not.be.rejectedWith();
    });

});

describe(`'update association' mutation`, () => {

    it('should update association', async () => {

        // setup
        const mindmap = new Mindmap();

        mindmap.associations.set('id', new Association({
            id: 'id',
            value: 'old'
        }));

        const state = {model: {mindmap}};

        const patch = new Patch(
            'update association',
            {id: 'id', value: 'new'}
        );

        // target
        const result = await mutate(state, patch);

        // check
        const assocs = values(result.model.mindmap.associations);

        expect(assocs).to.have.length(1);
        expect(assocs[0]).to.containSubset({
            id: 'id',
            value: 'new'
        });
    });

    it('should fail if target association was not found', async () => {
        
        // setup
        const mindmap = new Mindmap();

        const state = {model: {mindmap}};

        const patch = new Patch(
            'update association',
            {id: 'id', value: 'new'}
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            `Association 'id' was not found`);
    });

});

describe(`'remove association' mutation`, () => {

    it('should remove association from map', async () => {

        // setup graph
        //
        //  (root) --> (head) -->
        //
        const mindmap = new Mindmap();

        const ideaRoot = new Idea({id: 'root', isRoot: true});
        const ideaHead = new Idea({id: 'head'});

        const assocLive = new Association({
            id: 'live',
            fromId: 'root',
            from: ideaRoot,
            toId: 'head',
            to: ideaHead
        });

        const assocDie = new Association({
            id: 'die',
            fromId: 'head',
            from: ideaHead,
            toId: null,
            to: null
        });

        ideaRoot.associationsOut = [assocLive];
        ideaHead.associationsOut = [assocDie];
        ideaHead.associationsIn = [assocLive];

        mindmap.ideas.set(ideaRoot.id, ideaRoot);
        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.associations.set(assocLive.id, assocLive);
        mindmap.associations.set(assocDie.id, assocDie);
        mindmap.root = ideaRoot;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'remove association',
            {id: 'die'}
        );

        // target
        const result = await mutate(state, patch);
        const assocs = values(result.model.mindmap.associations);

        // check
        expect(assocs).to.have.length(1);
        expect(assocs[0].id).to.equal('live');
    });

    it('should remove association from head idea', async () => {
        
        // setup graph
        //
        //  (root) --> (head) -->
        //
        const mindmap = new Mindmap();

        const ideaRoot = new Idea({id: 'root', isRoot: true});
        const ideaHead = new Idea({id: 'head'});

        const assocLive = new Association({
            id: 'live',
            from: ideaRoot,
            to: ideaHead
        });

        const assocDie = new Association({
            id: 'die',
            from: ideaHead,
            to: null
        });

        ideaRoot.associationsOut = [assocLive];
        ideaHead.associationsOut = [assocDie];

        mindmap.ideas.set(ideaRoot.id, ideaRoot);
        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.associations.set(assocLive.id, assocLive);
        mindmap.associations.set(assocDie.id, assocDie);
        mindmap.root = ideaRoot;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'remove association',
            {id: 'die'}
        );

        // target
        const result = await mutate(state, patch);

        // check
        const idea = result.model.mindmap.ideas.get('head');
        expect(idea.associationsOut).to.be.empty;
    });

    it('should fail if association was not found', async () => {
        
        // setup graph
        //
        //  (root) --> (head) -->
        //
        const mindmap = new Mindmap();

        const rootIdea = new Idea({id: 'root', isRoot: true});
        const headIdea = new Idea({id: 'head'});

        const assocLive = new Association({
            id: 'live',
            from: rootIdea,
            to: headIdea
        });

        rootIdea.associationsOut = [assocLive];
        headIdea.associationsOut = [];

        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.ideas.set(headIdea.id, headIdea);

        mindmap.associations.set(assocLive.id, assocLive);
        mindmap.root = rootIdea;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'remove association',
            {id: 'die'}
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            `Association 'die' was not found`);
    });

    it('should fail if association has no head idea', async () => {
        
        // setup graph
        //
        //  (root) --> (head) -->
        //
        const mindmap = new Mindmap();

        const ideaRoot = new Idea({id: 'root', isRoot: true});
        const ideaHead = new Idea({id: 'head'});

        const assocLive = new Association({
            id: 'live',
            from: ideaRoot,
            to: ideaHead
        });

        const assocDie = new Association({
            id: 'die',
            from: null, // no head idea
            to: null
        });

        ideaRoot.associationsOut = [assocLive];
        ideaHead.associationsOut = [assocDie];

        mindmap.ideas.set(ideaRoot.id, ideaRoot);
        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.associations.set(assocLive.id, assocLive);
        mindmap.associations.set(assocDie.id, assocDie);
        mindmap.root = ideaRoot;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'remove association',
            {id: 'die'}
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            `Association 'die' has no reference to head idea`);
    });

    it('should fail if association has tail idea', async () => {
        
        // setup graph
        //
        //  (root) --> (head) --> (tail)
        //
        const mindmap = new Mindmap();

        const ideaRoot = new Idea({id: 'root', isRoot: true});
        const ideaHead = new Idea({id: 'head'});
        const ideaTail = new Idea({id: 'tail'});

        const assocLive = new Association({
            id: 'live',
            from: ideaRoot,
            to: ideaHead
        });

        const assocDie = new Association({
            id: 'die',
            from: ideaHead,
            to: ideaTail // has reference to tail
        });

        ideaRoot.associationsOut = [assocLive];
        ideaHead.associationsOut = [assocDie];

        mindmap.ideas.set(ideaRoot.id, ideaRoot);
        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.associations.set(assocLive.id, assocLive);
        mindmap.associations.set(assocDie.id, assocDie);
        mindmap.root = ideaRoot;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'remove association',
            {id: 'die'}
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            `Association 'die' cannot be removed ` +
            `because it has reference to tail idea`);
    });

    it('should fail if head idea has no association', async () => {
        
        // setup graph
        //
        //  (root) --> (head) -->
        //
        const mindmap = new Mindmap();

        const ideaRoot = new Idea({id: 'root', isRoot: true});
        const ideaHead = new Idea({id: 'head'});

        const assocLive = new Association({
            id: 'live',
            from: ideaRoot,
            to: ideaHead
        });

        const assocDie = new Association({
            id: 'die',
            from: ideaHead,
            to: null
        });

        ideaRoot.associationsOut = [assocLive];
        ideaHead.associationsOut = []; // no association to remove

        mindmap.ideas.set(ideaRoot.id, ideaRoot);
        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.associations.set(assocLive.id, assocLive);
        mindmap.associations.set(assocDie.id, assocDie);
        mindmap.root = ideaRoot;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'remove association',
            {id: 'die'}
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            `Head idea 'head' has no reference ` +
            `to outgoing association 'die'`);
    });
});

describe(`'update mindmap' mutation`, () => {

    it('should update mindmap', async () => {

        // setup
        const mindmap = new Mindmap({
            id: 'id',
            scale: 1,
            x: 100
        });

        const state = {model: {mindmap}};
        
        const patch = new Patch(
            'update mindmap',
            {id: 'id', scale: 2}
        );

        // target
        const result = await mutate(state, patch);

        // check
        expect(result.model.mindmap).to.containSubset({
            id: 'id',
            scale: 2,
            x: 100
        });
    });

});