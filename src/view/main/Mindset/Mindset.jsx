import React, {Component, Fragment} from 'react';
import cx from 'classnames';

import getKeyCode from 'view/utils/dom/get-key-code';
import ConnectionState from 'action/utils/ConnectionState';

import MindsetType from 'vm/main/Mindset';
import IconType from 'vm/shared/Icon';
import IconSize from 'vm/shared/IconSize';

import Mindmap from 'view/map/entities/Mindmap';
import Zen from 'view/zen/entities/Zen';

import ColorPicker from 'view/shared/ColorPicker';
import SearchBox from 'view/shared/SearchBox';
import IconButton from 'view/shared/IconButton';
import Icon from 'view/shared/Icon';

import classes from './Mindset.css';
import ViewMode from 'vm/main/MindsetViewMode';

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {MindsetType} mindset
 *
 * @prop {function({code, ctrlKey, preventDefault})} onKeyDown
 * @prop {function()} onToggleMode
 * @prop {function()} onGoRootButtonClick
 * @prop {function()} onIdeaSearchTriggerClick
 * @prop {function()} onIdeaSearchLookupFocusOut
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
      onIdeaSearchLookupFocusOut,
      onIdeaSearchLookupPhraseChange,
      onIdeaSearchLookupKeyDown,
      onIdeaSearchLookupSuggestionSelect,
      onColorPickerChange
    } = this.props;

    const {dbServerConnectionIcon} = mindset;

    let view;

    if (mindset.isLoaded) {
      switch (mindset.mode) {
        case ViewMode.mindmap:
          view = <Mindmap mindmap={mindset.mindmap} />;
          break;

        case ViewMode.zen:
          view = <Zen zen={mindset.zen} />;
          break;

        default:
          throw Error(`Unknown mindset view mode '${mindset.mode}'`);
      }
    }

    return (
      <div
        className={cx(classes.root, {
          [classes.modeMindmap]: mindset.mode === ViewMode.mindmap,
          [classes.modeZen]: mindset.mode === ViewMode.zen
        })}
      >
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

            <IconButton
              className={classes.toggleModeButton}
              icon={mindset.toggleModeButton.icon}
              size={IconSize.large}
              tooltip={mindset.toggleModeButton.tooltip}
              onClick={onToggleMode}
            />

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
              tooltip={mindset.goRootButtonTooltip}
              onClick={onGoRootButtonClick}
            />

            <SearchBox
              className={classes.ideaSearchBox}
              searchBox={mindset.ideaSearchBox}
              lookupClass={classes.ideaSearchBoxLookup}
              triggerClass={classes.ideaSearchBoxTrigger}
              triggerIcon={IconType.search}
              onTriggerClick={onIdeaSearchTriggerClick}
              onLookupFocusOut={onIdeaSearchLookupFocusOut}
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
