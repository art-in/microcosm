import React, {Component} from 'react';
import cx from 'classnames';

import noop from 'utils/noop';

import DropDownMenuVmType from 'vm/shared/DropDownMenu';
import Menu from 'view/shared/Menu';

import classes from './DropDownMenu.css';

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {string} [triggerClass]
 * @prop {string} [popupClass]
 * @prop {JSX.Element} trigger
 * @prop {DropDownMenuVmType} ddmenu
 *
 * @prop {function()} [onFocusOut]
 * @prop {function()} onTriggerClick
 * @prop {function()} onItemSelect
 *
 * @extends {Component<Props>}
 */
export default class DropDownMenu extends Component {
  static defaultProps = {
    onFocusOut: noop
  };

  componentDidMount() {
    // react does not support focusin/focusout events, so we should subscribe
    // manually. 'blur' wont work because it does not bubble.
    this.container.addEventListener('focusout', this.onFocusOut);
  }

  componentWillUnmount() {
    this.container.removeEventListener('focusout', this.onFocusOut);
  }

  onFocusOut = nativeEvent => {
    // make sure focus leaves lookup container and its children
    if (nativeEvent.relatedTarget !== this.container) {
      this.props.onFocusOut();
    }
  };

  render() {
    const {
      ddmenu,
      className,
      trigger,
      popupClass,
      onTriggerClick,
      onItemSelect
    } = this.props;
    const {menu} = ddmenu;

    return (
      <span
        className={cx(classes.root, className)}
        ref={node => (this.container = node)}
        // make sure focus stays in container, so we can catch focus out
        tabIndex={0}
      >
        {React.cloneElement(trigger, {onClick: onTriggerClick})}
        {ddmenu.isActive ? (
          <Menu
            className={cx(classes.popup, popupClass)}
            menu={menu}
            onItemSelect={onItemSelect}
          />
        ) : null}
      </span>
    );
  }
}
