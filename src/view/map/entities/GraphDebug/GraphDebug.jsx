import React, {Component} from 'react';

import round from 'utils/round';
import GraphVmType from 'vm/map/entities/Graph';

// @ts-ignore
import classes from './GraphDebug.css';

/**
 * @typedef {object} Props
 * @prop {GraphVmType} graph
 * 
 * @extends {Component<Props>}
 */
export default class GraphDebug extends Component {

    render() {
        
        const {graph, graph: {viewbox}} = this.props;

        if (!graph.debug) {
            return null;
        }
        
        const focusZoneMax = round(graph.debugInfo.focusZoneMax);
        const shadeZoneMax = round(graph.debugInfo.shadeZoneMax);

        const lines = [
            ['viewbox',
                `(${round(viewbox.x)}; ${round(viewbox.y)}) - ` +
                `(${round(viewbox.width)}; ${round(viewbox.height)})`],

            ['scale', round(viewbox.scale, 2)],
            ['drag', graph.drag.active.toString()],
            ['pan', graph.pan.active.toString()],

            ['focus center', round(graph.debugInfo.focusCenter, 2)],
            ['focus zone', `(Infinity - ${focusZoneMax}]`],
            ['shade zone', `(${focusZoneMax} - ${shadeZoneMax}]`],
            ['hide zone', `(${shadeZoneMax} - Infinity)`]
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