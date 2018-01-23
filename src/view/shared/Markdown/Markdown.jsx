import React, {Component} from 'react';
import cx from 'classnames';

import MarkdownIt from 'markdown-it';
import TaskListsPlugin from 'markdown-it-task-lists';

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
    tag: 'div'
  };

  constructor(props, context) {
    super(props, context);

    this.md = new MarkdownIt({
      // autoconvert URL-like text to links
      linkify: true
    });

    // add github-like checkbox lists
    this.md.use(TaskListsPlugin, {
      // disable check boxes since checking them will not change
      // source markdown
      // TODO: update source markdown when triggering checkboxes.
      enabled: false,
      label: false
    });
  }

  render() {
    const {tag, source, className, ...other} = this.props;

    const html = this.md.render(source);

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
