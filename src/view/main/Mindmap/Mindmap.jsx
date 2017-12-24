import React, {Component} from 'react';
import cx from 'classnames';
import icons from 'font-awesome/css/font-awesome.css';

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
        
        let icon;

        switch (connectionState) {

        case ConnectionState.connected:
            icon = icons.faServer;
            break;
    
        case ConnectionState.disconnected:
            icon = icons.faPlug;
            break;

        default: throw Error(
            `Unknown DB server connection state '${connectionState}'`);
        }

        return icon;
    }

    render() {
        
        const {mindmap, ...other} = this.props;
        const {dbServerConnectionIcon} = mindmap;

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
                
                <span className={cx(
                    classes.dbConnectionStateIcon,
                    icons.fa,
                    icons.faLg,
                    this.getDBConnectionStateIcon(dbServerConnectionIcon.state)
                )}
                title={dbServerConnectionIcon.tooltip}>
                </span>
            </div>
        );
    }

}