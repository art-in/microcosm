import {expect, createDB} from 'test/utils';

import mutate from 'src/state/mutator/model';

import Patch from 'src/state/Patch';
import Mindmap from 'src/domain/models/Mindmap';
import Idea from 'src/domain/models/Idea';
import Association from 'src/domain/models/Association';

describe('model', () => {

    describe(`'init' mutation`, () => {

        it('should init mindmap model from db', async () => {

            // setup
            const initial = {mindmap: undefined};

            const patchData = {
                db: {
                    ideas: createDB(),
                    associations: createDB(),
                    mindmaps: createDB()
                }
            };

            await patchData.db.ideas.post({_id: 'idea 1', isCentral: true});
            await patchData.db.ideas.post({_id: 'idea 2'});
            await patchData.db.associations.post({fromId: 'idea 1', toId: 'idea 2'});
            await patchData.db.mindmaps.post({});

            const patch = new Patch('init', patchData);

            // target
            const result = await mutate(initial, patch);

            // check
            expect(result.mindmap).to.exist;
            expect(result.mindmap.root).to.exist;
            expect(result.mindmap.ideas).to.have.length(2);
            expect(result.mindmap.associations).to.have.length(1);
        });

    });

    describe(`'add idea' mutation`, () => {

        it('should add idea to ideas list', async () => {

            // setup
            const rootIdea = new Idea({id: 'root'});
            const assoc = new Association({fromId: 'root', toId: 'idea 1'});
            rootIdea.associations = [assoc];

            const mindmap = new Mindmap();
            mindmap.root = rootIdea;
            mindmap.ideas = [rootIdea];
            mindmap.associations = [assoc];

            const model = {mindmap};

            const patch = new Patch(
                'add idea',
                new Idea({id: 'idea 1', value: 'test'})
            );

            // target
            const result = await mutate(model, patch);

            // check
            expect(result.mindmap.ideas).to.have.length(2);
            expect(result.mindmap.ideas[1]).to.containSubset({
                id: 'idea 1',
                value: 'test'
            });
        });

        it('should connect incoming associations to idea', async () => {
            
            // setup
            const rootIdea = new Idea({id: 'root'});
            const assoc = new Association({fromId: 'root', toId: 'idea 1'});
            rootIdea.associations = [assoc];

            const mindmap = new Mindmap();
            mindmap.root = rootIdea;
            mindmap.ideas = [rootIdea];
            mindmap.associations = [assoc];

            const model = {mindmap};

            const patch = new Patch(
                'add idea',
                new Idea({id: 'idea 1', value: 'test'})
            );

            // target
            const result = await mutate(model, patch);

            // check
            expect(result.mindmap.root).to.containSubset({
                id: 'root',
                associations: [{
                    to: {
                        id: 'idea 1'
                    }
                }]
            });
        });

        it('should init outgoing associations of idea', async () => {
            
            // setup
            const rootIdea = new Idea({id: 'root'});
            const assoc = new Association({fromId: 'root', toId: 'idea 1'});
            rootIdea.associations = [assoc];

            const mindmap = new Mindmap();
            mindmap.root = rootIdea;
            mindmap.ideas = [rootIdea];
            mindmap.associations = [assoc];

            const model = {mindmap};

            const patch = new Patch(
                'add idea',
                new Idea({id: 'idea 1', value: 'test'})
            );

            // target
            const result = await mutate(model, patch);

            // check
            expect(result.mindmap.ideas).to.have.length(2);
            expect(result.mindmap.ideas[1].associations).to.be.empty;
        }); 

        it('should add root idea without incoming association', async () => {
            
            // setup
            const model = {mindmap: new Mindmap()};

            const patch = new Patch(
                'add idea',
                new Idea({id: 'root', isCentral: true})
            );

            // target
            const result = await mutate(model, patch);

            // check
            expect(result.mindmap.ideas).to.have.length(1);
            expect(result.mindmap.root).to.containSubset({
                id: 'root'
            });
        });

        it('should throw if mindmap already has root idea', async () => {
            
            // setup
            const rootIdea = new Idea({id: 'root', isCentral: true});
            const mindmap = new Mindmap();
            mindmap.root = rootIdea;
            mindmap.ideas.push(rootIdea);
            const model = {mindmap};

            const patch = new Patch(
                'add idea',
                new Idea({id: 'root', isCentral: true})
            );

            // target
            const promise = mutate(model, patch);

            // check
            await expect(promise).to.be.rejectedWith(
                'Mindmap already has root idea');
        });

        it('should throw if no incoming associations was found', async () => {
            
            // setup
            const model = {mindmap: new Mindmap()};

            const patch = new Patch(
                'add idea',
                new Idea({id: 'idea 1', value: 'test'})
            );

            // target
            const promise = mutate(model, patch);

            // check
            await expect(promise).to.be.rejectedWith(
                `No incoming associations found for idea 'idea 1'`);
        });
    });

    describe(`'update idea' mutation`, () => {

        it('should update idea', async () => {

            // setup
            const model = {mindmap: new Mindmap()};

            model.mindmap.ideas.push(new Idea({
                id: 'id',
                value: 'old',
                color: 'white'
            }));

            const patch = new Patch(
                'update idea',
                {id: 'id', value: 'new'}
            );

            // target
            const result = await mutate(model, patch);

            // check
            expect(result.mindmap.ideas).to.have.length(1);
            expect(result.mindmap.ideas[0]).to.containSubset({
                id: 'id',
                value: 'new',
                color: 'white'
            });
        });

        it('should throw if target idea was not found', async () => {

            // setup
            const model = {mindmap: new Mindmap()};
            
            const patch = new Patch(
                'update idea',
                {id: 'id', value: 'new'}
            );

            // target
            const promise = mutate(model, patch);

            // check
            await expect(promise).to.be.rejectedWith(
                `Idea 'id' was not found`);
        });

    });

    describe(`'remove idea' mutation`, () => {

        it('should remove idea from ideas list', async () => {

            // setup
            const model = {mindmap: new Mindmap()};

            model.mindmap.ideas.push(new Idea({id: 'live'}));
            model.mindmap.ideas.push(new Idea({id: 'die'}));

            const patch = new Patch(
                'remove idea',
                {id: 'die'}
            );

            // target
            const result = await mutate(model, patch);

            // check
            expect(result.mindmap.ideas).to.have.length(1);
            expect(result.mindmap.ideas[0].id).to.equal('live');
        });

        it('should disconnect incoming associations from idea', async () => {

            // setup graph
            //
            //         (root)
            //        /       \
            //        v       v
            //     (live) --> (die)
            //
            const model = {mindmap: new Mindmap()};
            
            const rootIdea = new Idea({id: 'root', isCentral: true});
            const ideaLive = new Idea({id: 'live'});
            const ideaDie = new Idea({id: 'die'});

            const assoc1 = new Association({
                fromId: 'root',
                from: rootIdea,
                toId: 'live',
                to: ideaLive
            });

            const assoc2 = new Association({
                fromId: 'root',
                from: rootIdea,
                toId: 'die',
                to: ideaDie
            });

            rootIdea.associations = [assoc1, assoc2];

            const assoc3 = new Association({
                fromId: 'live',
                from: ideaLive,
                toId: 'die',
                to: ideaDie
            });

            ideaLive.associations = [assoc3];

            model.mindmap.ideas = [rootIdea, ideaLive, ideaDie];
            model.mindmap.associations = [assoc1, assoc2, assoc3];
            model.mindmap.root = rootIdea;

            const patch = new Patch(
                'remove idea',
                {id: 'die'}
            );

            // target
            const result = await mutate(model, patch);

            // check
            expect(result.mindmap.root).to.containSubset({
                id: 'root',
                associations: [{
                    fromId: 'root',
                    from: {id: 'root'},
                    toId: 'live',
                    to: {
                        id: 'live',
                        associations: [{
                            fromId: 'live',
                            from: {id: 'live'},
                            toId: null,
                            to: null
                        }]
                    }
                }, {
                    fromId: 'root',
                    from: {id: 'root'},
                    toId: null,
                    to: null
                }]
            });
        });

    });

    describe(`'add association' mutation`, () => {

        it('should add association to list', async () => {

            // setup
            const model = {mindmap: new Mindmap()};
            
            const rootIdea = new Idea({id: 'root', isCentral: true});
            const endingIdea = new Idea({id: 'ending'});

            model.mindmap.ideas = [rootIdea, endingIdea];
            model.mindmap.root = rootIdea;

            const patch = new Patch(
                'add association',
                new Association({
                    id: 'id',
                    value: 'test',
                    fromId: 'root',
                    toId: 'ending'
                })
            );

            // target
            const result = await mutate(model, patch);

            // check
            expect(result.mindmap.associations).to.have.length(1);
            expect(result.mindmap.associations[0]).to.containSubset({
                id: 'id',
                value: 'test'
            });
        });

        it('should connect association to starting idea', async () => {
            
            // setup
            const model = {mindmap: new Mindmap()};
            
            const rootIdea = new Idea({id: 'root', isCentral: true});
            const endingIdea = new Idea({id: 'ending'});

            model.mindmap.ideas = [rootIdea, endingIdea];
            model.mindmap.root = rootIdea;

            const patch = new Patch(
                'add association',
                new Association({
                    fromId: 'root',
                    toId: 'ending'
                })
            );

            // target
            const result = await mutate(model, patch);

            // check
            expect(result.mindmap.root).to.containSubset({
                id: 'root',
                associations: [{
                    fromId: 'root',
                    from: {id: 'root'}
                }]
            });

        });

        it('should connect association to ending idea', async () => {

            // setup
            const model = {mindmap: new Mindmap()};
            
            const rootIdea = new Idea({id: 'root', isCentral: true});
            const endingIdea = new Idea({id: 'ending'});

            model.mindmap.ideas = [rootIdea, endingIdea];
            model.mindmap.root = rootIdea;

            const patch = new Patch(
                'add association',
                new Association({
                    fromId: 'root',
                    toId: 'ending'
                })
            );

            // target
            const result = await mutate(model, patch);

            // check
            expect(result.mindmap.root).to.containSubset({
                id: 'root',
                associations: [{
                    toId: 'ending',
                    to: {id: 'ending'}
                }]
            });

        });

        it('should throw if starting idea does not exist', async () => {
            
            // setup
            const model = {mindmap: new Mindmap()};
            
            const rootIdea = new Idea({id: 'root', isCentral: true});
            const endingIdea = new Idea({id: 'ending'});

            model.mindmap.ideas = [rootIdea, endingIdea];
            model.mindmap.root = rootIdea;

            const patch = new Patch(
                'add association',
                new Association({
                    fromId: 'NOT EXIST',
                    toId: 'ending'
                })
            );

            // target
            const promise = mutate(model, patch);

            // check
            await expect(promise).to.be.rejectedWith(
                `Starting idea 'NOT EXIST' not found for association`);
        });

        it('should NOT throw if ending idea does not exist', async () => {
            
            // setup
            const model = {mindmap: new Mindmap()};
            
            const rootIdea = new Idea({id: 'root', isCentral: true});

            model.mindmap.ideas = [rootIdea];
            model.mindmap.root = rootIdea;

            const patch = new Patch(
                'add association',
                new Association({
                    fromId: 'root',
                    toId: 'ending'
                })
            );

            // target
            const promise = mutate(model, patch);

            // check
            await expect(promise).to.not.be.rejectedWith();
        });

    });

    describe(`'update association' mutation`, () => {

        it('should update association', async () => {

            // setup
            const model = {mindmap: new Mindmap()};

            model.mindmap.associations.push(new Association({
                id: 'id',
                value: 'old',
                from: 'from'
            }));

            const patch = new Patch(
                'update association',
                {id: 'id', value: 'new'}
            );

            // target
            const result = await mutate(model, patch);

            // check
            expect(result.mindmap.associations).to.have.length(1);
            expect(result.mindmap.associations[0]).to.containSubset({
                id: 'id',
                value: 'new',
                from: 'from'
            });
        });

        it('should throw if target association was not found', async () => {
            
            // setup
            const model = {mindmap: new Mindmap()};

            const patch = new Patch(
                'update association',
                {id: 'id', value: 'new'}
            );

            // target
            const promise = mutate(model, patch);

            // check
            await expect(promise).to.be.rejectedWith(
                `Association 'id' was not found`);
        });

    });

    describe(`'remove association' mutation`, () => {

        it('should remove association from list', async () => {

            // setup graph
            //
            //  (root) --> (idea 1) -->
            //
            const model = {mindmap: new Mindmap()};

            const rootIdea = new Idea({id: 'root', isCentral: true});
            const idea1 = new Idea({id: 'idea 1'});

            const assocLive = new Association({
                id: 'live',
                from: rootIdea,
                to: idea1
            });

            const assocDie = new Association({
                id: 'die',
                from: idea1,
                to: null
            });

            rootIdea.associations = [assocLive];
            idea1.associations = [assocDie];

            model.mindmap.ideas = [rootIdea, idea1];
            model.mindmap.associations = [assocLive, assocDie];
            model.mindmap.root = rootIdea;

            const patch = new Patch(
                'remove association',
                {id: 'die'}
            );

            // target
            const result = await mutate(model, patch);

            // check
            expect(result.mindmap.associations).to.have.length(1);
            expect(result.mindmap.associations[0].id).to.equal('live');
        });

        it('should disconnect association from starting idea', async () => {
            
            // setup graph
            //
            //  (root) --> (idea 1) -->
            //
            const model = {mindmap: new Mindmap()};

            const rootIdea = new Idea({id: 'root', isCentral: true});
            const idea1 = new Idea({id: 'idea 1'});

            const assocLive = new Association({
                id: 'live',
                from: rootIdea,
                to: idea1
            });

            const assocDie = new Association({
                id: 'die',
                from: idea1,
                to: null
            });

            rootIdea.associations = [assocLive];
            idea1.associations = [assocDie];

            model.mindmap.ideas = [rootIdea, idea1];
            model.mindmap.associations = [assocLive, assocDie];
            model.mindmap.root = rootIdea;

            const patch = new Patch(
                'remove association',
                {id: 'die'}
            );

            // target
            const result = await mutate(model, patch);

            // check
            const idea = result.mindmap.ideas.find(i => i.id === 'idea 1');
            expect(idea.associations).to.be.empty;

            expect(result.mindmap.root).to.containSubset({
                id: 'root',
                associations: [{
                    from: {id: 'root'},
                    to: {
                        id: 'idea 1'
                    }
                }]
            });
        });

        it('should throw if association was not found in list', async () => {
            
            // setup graph
            //
            //  (root) --> (idea 1) -->
            //
            const model = {mindmap: new Mindmap()};

            const rootIdea = new Idea({id: 'root', isCentral: true});
            const idea1 = new Idea({id: 'idea 1'});

            const assocLive = new Association({
                id: 'live',
                from: rootIdea,
                to: idea1
            });

            const assocDie = new Association({
                id: 'die',
                from: idea1,
                to: null
            });

            rootIdea.associations = [assocLive];
            idea1.associations = [assocDie];

            model.mindmap.ideas = [rootIdea, idea1];
            model.mindmap.associations = [assocLive]; // no association to remove
            model.mindmap.root = rootIdea;

            const patch = new Patch(
                'remove association',
                {id: 'die'}
            );

            // target
            const promise = mutate(model, patch);

            // check
            await expect(promise).to.be.rejectedWith(
                `Association 'die' was not found`);
        });

        it('should throw if association has no starting idea', async () => {
            
            // setup graph
            //
            //  (root) --> (idea 1) -->
            //
            const model = {mindmap: new Mindmap()};

            const rootIdea = new Idea({id: 'root', isCentral: true});
            const idea1 = new Idea({id: 'idea 1'});

            const assocLive = new Association({
                id: 'live',
                from: rootIdea,
                to: idea1
            });

            const assocDie = new Association({
                id: 'die',
                from: null, // no starting idea
                to: null
            });

            rootIdea.associations = [assocLive];
            idea1.associations = [assocDie];

            model.mindmap.ideas = [rootIdea, idea1];
            model.mindmap.associations = [assocLive, assocDie];
            model.mindmap.root = rootIdea;

            const patch = new Patch(
                'remove association',
                {id: 'die'}
            );

            // target
            const promise = mutate(model, patch);

            // check
            await expect(promise).to.be.rejectedWith(
                `Association 'die' not connected to starting idea`);
        });

        it('should throw if starting idea has no association', async () => {
            
            // setup graph
            //
            //  (root) --> (idea 1) -->
            //
            const model = {mindmap: new Mindmap()};

            const rootIdea = new Idea({id: 'root', isCentral: true});
            const idea1 = new Idea({id: 'idea 1'});

            const assocLive = new Association({
                id: 'live',
                from: rootIdea,
                to: idea1
            });

            const assocDie = new Association({
                id: 'die',
                from: idea1,
                to: null
            });

            rootIdea.associations = [assocLive];
            idea1.associations = []; // no association to remove

            model.mindmap.ideas = [rootIdea, idea1];
            model.mindmap.associations = [assocLive, assocDie];
            model.mindmap.root = rootIdea;

            const patch = new Patch(
                'remove association',
                {id: 'die'}
            );

            // target
            const promise = mutate(model, patch);

            // check
            await expect(promise).to.be.rejectedWith(
                `Starting idea 'idea 1' not connected to association 'die'`);
        });
    });

    describe(`'update mindmap' mutation`, () => {

        it('should update mindmap', async () => {

            // setup
            const model = {mindmap: new Mindmap({
                id: 'id',
                scale: 1,
                x: 100
            })};
            
            const patch = new Patch(
                'update mindmap',
                {id: 'id', scale: 2}
            );

            // target
            const result = await mutate(model, patch);

            // check
            expect(result.mindmap).to.containSubset({
                id: 'id',
                scale: 2,
                x: 100
            });
        });

    });

});