import React, {Component} from 'react';
import cx from 'classnames';

import MindmapType from 'vm/main/Mindmap';
import ConnectionState from 'action/utils/ConnectionState';

import Graph from 'view/map/entities/Graph';

import classes from './Mindmap.css';

/**
 * @typedef {object} Props
 * @prop {MindmapType} mindmap
 * 
 * @extends {Component<Props>}
 */
export default class Mindmap extends Component {

    getDBConnectionStateIcon(connectionState) {
        
        switch (connectionState) {

        case ConnectionState.connected:
            return 'connected';
    
        case ConnectionState.disconnected:
            return 'disconnected';

        default: throw Error(
            `Unknown DB server connection state ` +
            `'${connectionState}'`);
        }
    }

    render() {
        
        const {mindmap, ...other} = this.props;
        const {dbServerConnection} = mindmap;

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
                
                <div className={classes.dbConnectionStateIcon}
                    title={dbServerConnection.tooltip}>
                    {this.getDBConnectionStateIcon(dbServerConnection.state)}
                </div>

            </div>
        );
    }

}