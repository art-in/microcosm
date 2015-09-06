Chart = React.createClassWithCSS({
  css: {
    chart: {
      border: '1px solid red'
    },
    rect: {
      fill: '#00aa00'
    }
  },
  render() {
    let data = [4, 8, 15, 16, 23, 42];
    let width = 420;
    let barHeight = 20;
    let x = d3.scale.linear()
      .domain([0, d3.max(data)])
      .range([0, width]);
    let chart = d3.select('.' + this.css().chart)
      .attr('width', width)
      .attr('height', barHeight * data.length);
    let bar = chart.selectAll('g')
      .data(data)
      .enter().append('g')
      .attr('transform', function(d, i) {
        return 'translate(0,' + i * barHeight + ')';
      });

    bar.append('rect')
      .attr('class', this.css().rect)
      .attr('width', x)
      .attr('height', barHeight - 1);

    bar.append('text')
      .attr('x', function(d) {
        return x(d) - 3;
      })
      .attr('y', barHeight / 2)
      .attr('dy', '.35em')
      .text(function(d) {
        return d;
      });

    return (<svg className={ this.css().chart }></svg>);
  }
});