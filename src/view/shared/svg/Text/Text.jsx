import React, {Component} from 'react';
import cx from 'classnames';

import PointType from 'model/entities/Point';

import classes from './Text.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {string} [text]
 * @prop {'start'|'middle'|'end'} [align]
 * @prop {PointType} pos
 *
 * @extends {Component<Props>}
 */
export default class Text extends Component {
  static defaultProps = {
    text: ''
  };

  render() {
    const {text, align, pos, className, ...other} = this.props;

    return (
      <text
        className={cx(classes.root, className)}
        textAnchor={align}
        x={pos ? pos.x : null}
        y={pos ? pos.y : null}
        {...other}
      >
        {text}
      </text>
    );
  }
}
