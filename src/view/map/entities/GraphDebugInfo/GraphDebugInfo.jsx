import React, {Component} from 'react';
import PropTypes from 'prop-types';

import GraphVM from 'vm/map/entities/Graph';

import classes from './GraphDebugInfo.css';

export default class GraphDebugInfo extends Component {

    static propTypes = {
        graph: PropTypes.instanceOf(GraphVM).isRequired
    }

    render() {
        
        const {graph, graph: {viewbox}} = this.props;
        const {round} = Math;
        
        return (
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
        );
    }

}