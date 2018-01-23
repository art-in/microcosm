import React, {Component, Fragment} from 'react';
import cx from 'classnames';

import getKeyCode from 'view/utils/dom/get-key-code';
import ConnectionState from 'action/utils/ConnectionState';

import MindsetType from 'vm/main/Mindset';
import IconType from 'vm/shared/Icon';
import IconSize from 'vm/shared/IconSize';

import Mindmap from 'view/map/entities/Mindmap';
import SearchBox from 'view/shared/SearchBox';
import IconButton from 'view/shared/IconButton';
import Icon from 'view/shared/Icon';

import classes from './Mindset.css';

/**
 * @typedef {object} Props
 * @prop {MindsetType} mindset
 * @prop {function({code, ctrlKey, preventDefault})} onKeyDown
 * @prop {function()} onGoRootButtonClick
 * @prop {function()} onIdeaSearchTriggerClick
 * @prop {function()} onIdeaSearchLookupPhraseChange
 * @prop {function()} onIdeaSearchLookupKeyDown
 * @prop {function()} onIdeaSearchLookupSuggestionSelect
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
      code: getKeyCode(nativeEvent),
      ctrlKey: nativeEvent.ctrlKey,
      preventDefault: nativeEvent.preventDefault.bind(nativeEvent)
    });
  };

  getDBConnectionStateIcon(connectionState) {
    let icon;

    switch (connectionState) {
      case ConnectionState.connected:
        icon = IconType.server;
        break;

      case ConnectionState.disconnected:
        icon = IconType.plug;
        break;

      default:
        throw Error(`Unknown DB server connection state '${connectionState}'`);
    }

    return icon;
  }

  render() {
    const {
      mindset,
      onGoRootButtonClick,
      onIdeaSearchTriggerClick,
      onIdeaSearchLookupPhraseChange,
      onIdeaSearchLookupKeyDown,
      onIdeaSearchLookupSuggestionSelect
    } = this.props;
    const {dbServerConnectionIcon} = mindset;

    return (
      <div className={cx(classes.root)}>
        {!mindset.isLoaded &&
          !mindset.isLoadFailed && (
            <div className={classes.message}>Mindset is loading...</div>
          )}

        {mindset.isLoadFailed && (
          <div className={classes.message}>Mindset load failed</div>
        )}

        {mindset.isLoaded ? (
          <Fragment>
            <Mindmap mindmap={mindset.mindmap} />

            <Icon
              className={classes.dbConnectionStateIcon}
              icon={this.getDBConnectionStateIcon(dbServerConnectionIcon.state)}
              size={IconSize.large}
              tooltip={dbServerConnectionIcon.tooltip}
            />

            <IconButton
              className={classes.goRootButton}
              icon={IconType.home}
              size={IconSize.large}
              tooltip="Go to root idea (Home)"
              onClick={onGoRootButtonClick}
            />

            <SearchBox
              className={classes.ideaSearchBox}
              searchBox={mindset.ideaSearchBox}
              lookupClass={classes.ideaSearchBoxLookup}
              triggerClass={classes.ideaSearchBoxTrigger}
              triggerIcon={IconType.search}
              triggerTooltip="Search ideas (Ctrl+F)"
              onTriggerClick={onIdeaSearchTriggerClick}
              onLookupPhraseChange={onIdeaSearchLookupPhraseChange}
              onLookupKeyDown={onIdeaSearchLookupKeyDown}
              onLookupSuggestionSelect={onIdeaSearchLookupSuggestionSelect}
            />
          </Fragment>
        ) : null}
      </div>
    );
  }
}
