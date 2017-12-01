import React, {Component} from 'react';
import cx from 'classnames';

import MindmapType from 'vm/main/Mindmap';

import Graph from 'view/map/entities/Graph';

// @ts-ignore
import classes from './Mindmap.css';

/**
 * @typedef {object} Props
 * @prop {MindmapType} mindmap
 * 
 * @extends {Component<Props>}
 */
export default class Mindmap extends Component {

    render() {

        const {mindmap, ...other} = this.props;
        
        return (
            <div className={cx(classes.root)}
                {...other}>

                <Graph graph={mindmap.graph} />

            </div>
        );
    }

}