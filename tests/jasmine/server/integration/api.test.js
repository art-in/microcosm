importing([
      'models/Mindmap',
      'models/Idea',
      'models/Assoc',
      'collections/Mindmaps',
      'collections/Ideas',
      'collections/Assocs'
    ],
    function(
        Mindmap, Idea, Assoc,
        Mindmaps, Ideas, Assocs) {

      describe('API', function() {

        let db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;

        beforeAll(() => {
          Mindmaps.removeAll();

          let mindmap = new Mindmap();
          Mindmaps.insert(mindmap);
        });

        describe('create idea', () => {

          beforeEach(() => {
            Ideas.removeAll();
            Assocs.removeAll();
          });

          it('should exist', () => {
            expect(() => {
              Meteor.call('api.mindmap.createIdea');
            }).not.toThrowError(Meteor.Error);
          });

          it('should create idea', () => {
            let mindmap = Mindmaps.findOne();

            Meteor.call('api.mindmap.createIdea', {mindmapId: mindmap.id});

            let ideas = Ideas.fetchAll();
            let assocs = Assocs.fetchAll();

            expect(ideas.length).toEqual(1);
            expect(ideas[0].mindmapId).toEqual(mindmap.id);
            expect(assocs.length).toEqual(0);
          });

          it('should create idea from parent', () => {
            let mindmap = Mindmaps.findOne();

            let parentIdea = new Idea();
            parentIdea.mindmapId = mindmap.id;
            Ideas.insert(parentIdea);

            Meteor.call('api.mindmap.createIdea', {
              mindmapId: mindmap.id,
              parentIdeaId: parentIdea.id
            });

            let ideas = Ideas.fetchAll();
            let assocs = Assocs.fetchAll();

            let newIdea = ideas.find(i => i.id !== parentIdea.id);

            expect(ideas.length).toEqual(2);
            expect(ideas[0].mindmapId).toEqual(mindmap.id);
            expect(ideas[1].mindmapId).toEqual(mindmap.id);

            expect(assocs.length).toEqual(1);
            expect(assocs[0].mindmapId).toEqual(mindmap.id);
            expect(assocs[0].from).toEqual(parentIdea.id);
            expect(assocs[0].to).toEqual(newIdea.id);
          });

        });

      });
    });