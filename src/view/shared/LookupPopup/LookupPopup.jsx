import React, {Component} from 'react';
import cx from 'classnames';

import LookupPopupVmType from 'vm/shared/LookupPopup';

import Popup from '../Popup';
import Lookup from '../Lookup';

import classes from './LookupPopup.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {LookupPopupVmType} lookupPopup
 *
 * @prop {function()} onPhraseChange
 * @prop {function()} onKeyDown
 * @prop {function()} onSuggestionSelect
 *
 * @extends {Component<Props>}
 */
export default class LookupPopup extends Component {
  render() {
    const {
      lookupPopup,
      className,
      onPhraseChange,
      onKeyDown,
      onSuggestionSelect,
      ...other
    } = this.props;
    const {popup, lookup} = lookupPopup;

    return (
      <Popup popup={popup} className={cx(classes.root, className)} {...other}>
        <Lookup
          lookup={lookup}
          onPhraseChange={onPhraseChange}
          onKeyDown={onKeyDown}
          onSuggestionSelect={onSuggestionSelect}
        />
      </Popup>
    );
  }
}
