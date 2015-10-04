importing([
      'lib/helpers/mongoHelpers',
      'models/Mindmap',
      'models/Idea',
      'models/Assoc',
      'collections/Mindmaps',
      'collections/Ideas',
      'collections/Assocs',
      'mappers/mindmapMapper',
      'mappers/ideaMapper'
    ],
    function(
        mongoHelpers,
        Mindmap, Idea, Assoc,
        Mindmaps, Ideas, Assocs,
        mindmapMapper, ideaMapper) {

      let idToStr = mongoHelpers.idToStr;
      let mindmapToDbo = mindmapMapper.mindmapToDbo;
      let dboToMindmap = mindmapMapper.dboToMindmap;
      let ideaToDbo = ideaMapper.ideaToDbo;
      let dboToIdea = ideaMapper.dboToIdea;

      describe('API', function() {

        let db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;

        beforeAll(() => {
          Mindmaps.remove({});

          let mindmap = new Mindmap();
          Mindmaps.insert(mindmapToDbo(mindmap));
        });

        describe('create idea', () => {

          beforeEach(() => {
            Ideas.remove({});
            Assocs.remove({});
          });

          it('should exist', () => {
            expect(() => {
              Meteor.call('api.mindmap.createIdea');
            }).not.toThrowError(Meteor.Error);
          });

          it('should create idea', () => {
            let mindmap = dboToMindmap(Mindmaps.findOne());

            Meteor.call('api.mindmap.createIdea', {mindmapId: mindmap.id});

            let ideas = Ideas.find().fetch();
            let assocs = Assocs.find().fetch();

            expect(ideas.length).toEqual(1);
            expect(ideas[0].mindmapId).toEqual(mindmap.id);
            expect(assocs.length).toEqual(0);
          });

          it('should create idea from parent', () => {
            let mindmap = dboToMindmap(Mindmaps.findOne());

            let parentIdea = new Idea();
            parentIdea.mindmapId = mindmap.id;
            Ideas.insert(ideaToDbo(parentIdea));

            Meteor.call('api.mindmap.createIdea', {
              mindmapId: mindmap.id,
              parentIdeaId: parentIdea.id
            });

            let ideas = Ideas.find().fetch();
            let assocs = Assocs.find().fetch();

            let newIdea = dboToIdea(ideas.find(
                    i => i._id.valueOf() !== parentIdea.id));

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