Graph = React.createClassWithCSS({

  getInitialState() {
    return {
      width: 960,
      height: 500
    };
  },

  css: {
    graph: {
      'background-color': 'lightgray'
    },
    link: {
      'stroke': 'lightcoral'
    }
  },

  componentDidMount: function() {
    var svg = d3.select('body .' + this.css().graph)
      .append('svg')
      .attr('width', this.state.width)
      .attr('height', this.state.height);

    this.drawChart();
  },

  componentDidUpdate: function() {
    this.drawChart();
  },

  componentWillUnmount: function() {
    // Cleanup
  },

  drawChart() {
    var graph = GraphData;

    var color = d3.scale.category20();

    var svg = d3.selectAll('.' + this.css().graph + ' svg');

    var force = d3.layout.force()
      .charge(-120)
      .linkDistance(30)
      .size([this.state.width, this.state.height]);

    force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

    var link = svg.selectAll('.' + this.css().link)
      .data(graph.links)
      .enter().append('line')
      .attr('class', this.css().link)
      .style('stroke-width', function(d) {
        return Math.sqrt(d.value);
      });

    var node = svg.selectAll('.node')
      .data(graph.nodes)
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', 5)
      .style('fill', function(d) {
        return color(d.group);
      })
      .call(force.drag);

    node.append('title')
      .text(function(d) {
        return d.name;
      });

    force.on('tick', function() {
      link.attr('x1', function(d) {
        return d.source.x;
      })
        .attr('y1', function(d) {
          return d.source.y;
        })
        .attr('x2', function(d) {
          return d.target.x;
        })
        .attr('y2', function(d) {
          return d.target.y;
        });

      node.attr('cx', function(d) {
        return d.x;
      })
        .attr('cy', function(d) {
          return d.y;
        });
    });
  },

  render() {
    return (<section className={ this.css().graph }></section>);
  }
});