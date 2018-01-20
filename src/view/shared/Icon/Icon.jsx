import React, {Component} from 'react';
import cx from 'classnames';
import icons from 'font-awesome/css/font-awesome.css';

import IconType from 'vm/shared/Icon';
import IconSize from 'vm/shared/IconSize';

import mapIcon from 'view/utils/map-icon';
import mapIconSize from 'view/utils/map-icon-size';

import classes from './Icon.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {string} [tooltip]
 * @prop {IconSize} [size]
 * @prop {IconType} icon
 * 
 * @extends {Component<Props>}
 */
export default class IconButton extends Component {

    static defaultProps = {
        size: IconSize.default
    }

    render() {
        const {className, tooltip, icon, size, ...other} = this.props;

        return (
            <span className={cx(
                classes.root,
                className,
                icons.fa,
                mapIcon(icon).class,
                mapIconSize(size)
            )}
            title={tooltip}
            {...other} />
        );
    }

}