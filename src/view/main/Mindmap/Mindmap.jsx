import React, {Component} from 'react';
import cx from 'classnames';
import icons from 'font-awesome/css/font-awesome.css';

import MindmapType from 'vm/main/Mindmap';
import ConnectionState from 'action/utils/ConnectionState';

import Graph from 'view/map/entities/Graph';
import IdeaSearchBox from 'view/shared/IdeaSearchBox';

import classes from './Mindmap.css';

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {MindmapType} mindmap
 * @prop {function({code, ctrlKey, preventDefault})} onKeyDown
 * @prop {function()} onGoRootButtonClick
 * 
 * @extends {Component<Props>}
 */
export default class Mindmap extends Component {

    onKeyDown = e => {
        this.props.onKeyDown({
            code: e.nativeEvent.code,
            ctrlKey: e.ctrlKey,
            preventDefault: e.preventDefault.bind(e)
        });
    }

    componentDidMount() {
        // focus container for catching keyboard events
        this.container.focus();
    }

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
        
        const {mindmap, onGoRootButtonClick} = this.props;
        const {dbServerConnectionIcon} = mindmap;

        return (
            <div className={cx(classes.root)}
                // allow to set focus for catching keyboard events
                tabIndex={0}
                ref={node => this.container = node}
                onKeyDown={this.onKeyDown}>

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
                title={dbServerConnectionIcon.tooltip} />

                <span className={cx(
                    classes.goRootButton,
                    icons.fa,
                    icons.faLg,
                    icons.faHome
                )}
                title='Go to root idea'
                onClick={onGoRootButtonClick} />

                <IdeaSearchBox className={classes.ideaSearchBox}
                    searchBox={mindmap.ideaSearchBox} />
            </div>
        );
    }

}