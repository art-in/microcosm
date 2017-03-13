import React, {Component, PropTypes} from 'react';

import GraphVM from 'client/viewmodels/graph/Graph';

import classes from './GraphDebugInfo.css';

export default class GraphDebugInfo extends Component {

    static propTypes = {
        graph: PropTypes.instanceOf(GraphVM).isRequired
    }

    render() {
        
        const {graph, graph: {viewbox}} = this.props;
        const {round} = Math;
        
        return (
            <foreignObject>
                <div id={'debug'} className={ classes.root }>
                    { `viewbox: (${round(viewbox.x)}; ${round(viewbox.y)}) - ` +
                        `(${round(viewbox.width)}; ${round(viewbox.height)})` }
                    <br />
                    { `scale: ${viewbox.scale}` }
                    <br />
                    { `drag: ${graph.drag.active}` }
                    <br />
                    { `pan: ${graph.pan.active}` }
                </div>
            </foreignObject>
        );
    }

}