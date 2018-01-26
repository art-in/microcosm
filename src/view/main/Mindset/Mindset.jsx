import React, {Component, Fragment} from 'react';
import cx from 'classnames';

import getKeyCode from 'view/utils/dom/get-key-code';
import ConnectionState from 'action/utils/ConnectionState';

import MindsetType from 'vm/main/Mindset';
import IconType from 'vm/shared/Icon';
import IconSize from 'vm/shared/IconSize';

import Mindmap from 'view/map/entities/Mindmap';
import Mindlist from 'view/list/entities/Mindlist';

import ColorPicker from 'view/shared/ColorPicker';
import SearchBox from 'view/shared/SearchBox';
import IconButton from 'view/shared/IconButton';
import Icon from 'view/shared/Icon';

import classes from './Mindset.css';
import MindsetViewMode from 'vm/main/MindsetViewMode';

/**
 * @typedef {object} Props
 * @prop {MindsetType} mindset
 *
 * @prop {function({code, ctrlKey, preventDefault})} onKeyDown
 * @prop {function()} onToggleMode
 * @prop {function()} onGoRootButtonClick
 * @prop {function()} onIdeaSearchTriggerClick
 * @prop {function()} onIdeaSearchLookupPhraseChange
 * @prop {function()} onIdeaSearchLookupKeyDown
 * @prop {function()} onIdeaSearchLookupSuggestionSelect
 * @prop {function()} onColorPickerChange
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
      onToggleMode,
      onGoRootButtonClick,
      onIdeaSearchTriggerClick,
      onIdeaSearchLookupPhraseChange,
      onIdeaSearchLookupKeyDown,
      onIdeaSearchLookupSuggestionSelect,
      onColorPickerChange
    } = this.props;
    const {dbServerConnectionIcon} = mindset;

    let view;
    let toggleModeButton;

    if (mindset.isLoaded) {
      switch (mindset.mode) {
        case MindsetViewMode.mindmap:
          view = <Mindmap mindmap={mindset.mindmap} />;
          toggleModeButton = (
            <IconButton
              className={classes.toggleModeButton}
              icon={IconType.list}
              size={IconSize.large}
              tooltip="Switch to list mode"
              onClick={onToggleMode}
            />
          );
          break;

        case MindsetViewMode.list:
          view = <Mindlist list={mindset.list} />;
          toggleModeButton = (
            <IconButton
              className={classes.toggleModeButton}
              icon={IconType.map}
              size={IconSize.large}
              tooltip="Switch to mindmap mode"
              onClick={onToggleMode}
            />
          );
          break;

        default:
          throw Error(`Unknown mindset view mode '${mindset.mode}'`);
      }
    }

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
            {view}

            {toggleModeButton}

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

            <ColorPicker
              picker={mindset.colorPicker}
              onChange={onColorPickerChange}
            />
          </Fragment>
        ) : null}
      </div>
    );
  }
}
