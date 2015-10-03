importing([
  'client/mappers/graphMapper',
  'models/Mindmap',
  'models/Idea',
  'models/Assoc'],
    (graphMapper, Mindmap, Idea, Assoc) => {
      'use strict';

      let toGraph = graphMapper.mindmapToGraph;

      describe('graphMapper', () => {

        let mindmap;

        beforeEach(() => {
          mindmap = new Mindmap;
        });

        // afterEach(console.clear.bind(console));

        it('should map mindmap to graph', () => {
          let graph = toGraph(mindmap);
          expect(graph).not.toBeFalsy();
        });

        it('should map to the same count of nodes', () => {
          mindmap.ideas = [new Idea()];
          let graph = toGraph(mindmap);
          expect(graph.nodes.length).toBe(1);
        });

        it('should map to the same count of links', () => {
          let idea1 = new Idea();
          let idea2 = new Idea();

          let assoc = new Assoc();
          assoc.from = idea1.id;
          assoc.to = idea2.id;

          mindmap.ideas = [idea1, idea2];
          mindmap.assocs = [assoc];

          let graph = toGraph(mindmap);
          expect(graph.links.length).toBe(1);
        });

        it('should warn if there is no central node in result graph', () => {
          spyOn(console, 'warn');
          let graph = toGraph(mindmap);
          expect(console.warn).toHaveBeenCalledWith(
              'There is no central node in the tree');
        });

        it('should not warn if there is central node in result graph', () => {
          let centralIdea = new Idea();
          centralIdea.isCentral = true;

          mindmap.ideas = [centralIdea];

          spyOn(console, 'warn');
          let graph = toGraph(mindmap);
          expect(console.warn).not.toHaveBeenCalledWith(
              'There is no central node in the tree');
        });

        it('should color links with color of BOI', () => {
          let centralIdea = new Idea();
          centralIdea.isCentral = true;

          let boi1 = new Idea();
          let boi2 = new Idea();
          let boi2Sub1 = new Idea();
          let boi2Sub2 = new Idea();

          boi1.color = 'red';
          boi2.color = 'blue';

          let boi1Assoc = new Assoc(centralIdea.id, boi1.id);
          let boi2Assoc = new Assoc(centralIdea.id, boi2.id);
          let boi2Sub1Assoc = new Assoc(boi2.id, boi2Sub1.id);
          let boi2Sub2Assoc = new Assoc(boi2.id, boi2Sub2.id);

          mindmap.ideas = [centralIdea, boi1, boi2, boi2Sub1, boi2Sub2];
          mindmap.assocs = [boi1Assoc, boi2Assoc, boi2Sub1Assoc, boi2Sub2Assoc];

          let graph = toGraph(mindmap);

          let boi1Link = graph.links.find(l => l.id === boi1Assoc.id);
          let boi2Link = graph.links.find(l => l.id === boi2Assoc.id);
          let boi2Sub1Link = graph.links.find(l => l.id === boi2Sub1Assoc.id);
          let boi2Sub2Link = graph.links.find(l => l.id === boi2Sub2Assoc.id);

          expect(boi1Link.color).toBe('red');
          expect(boi2Link.color).toBe('blue');
          expect(boi2Sub1Link.color).toBe('blue');
          expect(boi2Sub2Link.color).toBe('blue');
        });

      });
    });