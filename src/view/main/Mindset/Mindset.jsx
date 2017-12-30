import React, {Component, Fragment} from 'react';
import cx from 'classnames';
import icons from 'font-awesome/css/font-awesome.css';

import MindsetType from 'vm/main/Mindset';
import ConnectionState from 'action/utils/ConnectionState';

import Mindmap from 'view/map/entities/Mindmap';
import IdeaSearchBox from 'view/shared/IdeaSearchBox';

import classes from './Mindset.css';

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {MindsetType} mindset
 * @prop {function({code, ctrlKey, preventDefault})} onKeyDown
 * @prop {function()} onGoRootButtonClick
 * 
 * @extends {Component<Props>}
 */
export default class Mindset extends Component {

    componentDidMount() {
        
        // listen keyboard events on body element, since otherwise it is not
        // always possible to keep focus on component container: if focused
        // element is removed from DOM - focus jumps to document body
        document.body.addEventListener('keydown', this.onKeyDown);
    }

    componentWillUnmount() {
        document.body.removeEventListener('keydown', this.onKeyDown);
    }

    onKeyDown = nativeEvent => {
        this.props.onKeyDown({
            code: nativeEvent.code,
            ctrlKey: nativeEvent.ctrlKey,
            preventDefault: nativeEvent.preventDefault.bind(nativeEvent)
        });
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
        
        const {mindset, onGoRootButtonClick} = this.props;
        const {dbServerConnectionIcon} = mindset;

        return (
            <div className={cx(classes.root)}>

                {!mindset.isLoaded && !mindset.isLoadFailed &&
                    <div className={classes.message}>
                        Mindset is loading...
                    </div>}

                {mindset.isLoadFailed &&
                    <div className={classes.message}>
                        Mindset load failed
                    </div>}

                {mindset.isLoaded ?
                    <Fragment>
                        <Mindmap mindmap={mindset.mindmap} />

                        <span className={cx(
                            classes.dbConnectionStateIcon,
                            icons.fa,
                            icons.faLg,
                            this.getDBConnectionStateIcon(
                                dbServerConnectionIcon.state)
                        )}
                        title={dbServerConnectionIcon.tooltip} />

                        <span className={cx(
                            classes.goRootButton,
                            icons.fa,
                            icons.faLg,
                            icons.faHome
                        )}
                        title='Go to root idea (Home)'
                        onClick={onGoRootButtonClick} />

                        <IdeaSearchBox className={classes.ideaSearchBox}
                            searchBox={mindset.ideaSearchBox} />
                    </Fragment>
                    : null}
            </div>
        );
    }

}