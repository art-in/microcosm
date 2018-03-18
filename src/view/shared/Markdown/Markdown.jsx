import React, {Component} from 'react';
import cx from 'classnames';

import MarkdownIt from 'markdown-it';
import TaskListsPlugin from 'markdown-it-task-lists';

import classes from './Markdown.css';

// uses CommonMark spec + few extensions from Github Flavored Markdown (GFM):
// - strikethrough (GFM). bug: requires two tildes instead of one.
//   https://github.com/markdown-it/markdown-it/issues/446
// - tables (GFM)
const md = new MarkdownIt({
  // enable autolinks (GFM)
  linkify: true
});

// allow any image formats, to extend default support (bmp, svg+xml, tiff only).
// https://github.com/markdown-it/markdown-it/issues/447
const defaultValidate = md.validateLink;
md.validateLink = url => /^data:image\/.*?;/.test(url) || defaultValidate(url);

// add checkbox lists (GFM)
md.use(TaskListsPlugin, {
  // disable check boxes since checking them will not change source markdown
  // TODO: implement interactive checking
  enabled: false,
  label: false
});

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
