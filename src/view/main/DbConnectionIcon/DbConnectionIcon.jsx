import React, {Component} from 'react';

import DbConnectionIconVmType from 'vm/main/DbConnectionIcon';
import IconSize from 'vm/shared/IconSize';

import Icon from 'view/shared/Icon';
import IconButton from 'view/shared/IconButton';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {DbConnectionIconVmType} connectionIcon
 * @prop {function()} onClick
 *
 * @extends {Component<Props>}
 */
export default class DbConnectionIcon extends Component {
  render() {
    const {className, connectionIcon, onClick} = this.props;

    return connectionIcon.isClickable ? (
      <IconButton
        className={className}
        icon={connectionIcon.icon}
        size={IconSize.large}
        tooltip={connectionIcon.tooltip}
        onClick={onClick}
      />
    ) : (
      <Icon
        className={className}
        icon={connectionIcon.icon}
        size={IconSize.large}
        tooltip={connectionIcon.tooltip}
      />
    );
  }
}
