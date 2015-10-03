importing([
      'client/views/graph/Graph',
      'client/viewmodels/graph/Graph',
      'client/viewmodels/graph/Node',
      'client/viewmodels/graph/Link'
    ],
    (GraphView, GraphVM, Node, Link) => {
      'use strict';

      describe('Graph view', () => {

        let sandbox;

        beforeEach(() => {
          sandbox = document.createElement('div');
        });

        it('should render SVG element', () => {

          let graph = new GraphVM();

          React.render(React.createElement(GraphView, {graph}), sandbox);

          let svg = sandbox.querySelector('svg');

          expect(sandbox.childNodes.length).toBeGreaterThan(0);
          expect(svg).toBeTruthy();
        });

        it('should render nodes', () => {

          let graph = new GraphVM();
          graph.nodes = [new Node(), new Node()];

          React.render(React.createElement(GraphView, {graph}), sandbox);

          let svg = sandbox.querySelector('svg');
          let nodes = svg.querySelectorAll('#nodes [name=Node]');

          expect(nodes.length).toEqual(2);
        });

        it('should render links', () => {

          let graph = new GraphVM();

          let node1 = new Node();
          let node2 = new Node();
          let link = new Link(node1, node2);

          graph.nodes = [node1, node2];
          graph.links = [link];

          React.render(React.createElement(GraphView, {graph}), sandbox);

          let svg = sandbox.querySelector('svg');
          let links = svg.querySelectorAll('#links [name=Link]');

          expect(links.length).toEqual(1);
        });

      });

    });