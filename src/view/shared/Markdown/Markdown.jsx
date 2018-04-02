import React, {Component} from 'react';
import cx from 'classnames';

import md from './init-md-renderer';
import classes from './Markdown.css';

/**
 * Markdown renderer
 *
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {string} [tag]
 * @prop {string} source - markdown text
 *
 * @prop {function()} [onDoubleClick]
 *
 * @extends {Component<Props>}
 */
export default class Markdown extends Component {
  static defaultProps = {
    tag: 'div',

    // parser always needs string
    source: ''
  };

  render() {
    const {tag, source, className, ...other} = this.props;

    const html = md.render(source);

    const Container = tag;

    return (
      <Container
        className={cx(classes.root, className)}
        dangerouslySetInnerHTML={{__html: html}}
        {...other}
      />
    );
  }
}
