import React, {Component} from 'react';
import PropTypes from 'prop-types';

import GraphVM from 'vm/map/entities/Graph';

import classes from './GraphDebug.css';

export default class GraphDebug extends Component {

    static propTypes = {
        graph: PropTypes.instanceOf(GraphVM).isRequired
    }

    render() {
        
        const {graph, graph: {viewbox}} = this.props;
        const {round} = Math;
        
        const lines = [
            ['viewbox',
                `(${round(viewbox.x)}; ${round(viewbox.y)}) - ` +
                `(${round(viewbox.width)}; ${round(viewbox.height)})`],

            ['scale', viewbox.scale],
            ['drag', graph.drag.active.toString()],
            ['pan', graph.pan.active.toString()],
            ['focus zone', graph.debugInfo.focusZone],
            ['shade zone', graph.debugInfo.shadeZone],
            ['hide zone', graph.debugInfo.hideZone]
        ];

        return (
            <div id={'debug'} className={classes.root}>
                {lines.map(line => (
                    <div key={line[0]}>
                        <span className={classes.title}>{line[0]}:</span>
                        <span className={classes.value}>{line[1]}</span>
                    </div>
                ))}
            </div>
        );
    }

}