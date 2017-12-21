import React, {Component} from 'react';
import cx from 'classnames';

import MindmapType from 'vm/main/Mindmap';

import Graph from 'view/map/entities/Graph';

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

                {!mindmap.isLoaded && !mindmap.isLoadFailed &&
                    <div className={classes.message}>
                        Mindmap is loading...
                    </div>}

                {mindmap.isLoadFailed &&
                    <div className={classes.message}>
                        Mindmap load failed
                    </div>}

                {mindmap.isLoaded ?
                    <Graph graph={mindmap.graph} />
                    : null}
                
            </div>
        );
    }

}