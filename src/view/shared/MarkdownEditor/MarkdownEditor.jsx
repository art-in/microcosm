import React, {Component} from 'react';
import cx from 'classnames';

import Icon from 'vm/shared/Icon';

import Markdown from 'view/shared/Markdown';
import IconButton from 'view/shared/IconButton';

import classes from './MarkdownEditor.css';

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {string} [editButtonClass]
 * @prop {boolean} [editing = false]
 * @prop {string} [placeholder]
 * @prop {string} value
 *
 * @prop {function(string)} onChange
 * @prop {function()} onToggleEdit
 * @prop {function()} [onDoubleClick]
 *
 * @extends {Component<Props>}
 */
export default class MarkdownEditor extends Component {
  onChange = e => {
    this.props.onChange(e.target.value);
  };

  componentDidUpdate(prevProps) {
    if (this.props.editing) {
      // auto-resize textarea to its contents, because by default it shrinks
      // to small area with scroll bar.
      this.textarea.style.height = this.textarea.scrollHeight + 'px';

      // after edit mode activated and textarea resized we can remove height
      // from container so it can grow / shrink normally.
      if (!prevProps.editing) {
        this.container.style.height = '';
      }
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    // preserve current height on container while activating edit mode, so
    // scroll of parent container not reset to zero.
    if (!prevProps.editing && this.props.editing) {
      const rect = this.container.getBoundingClientRect();
      const height = Math.round(rect.height);
      this.container.style.height = height + 'px';
    }

    return null;
  }

  render() {
    const {
      className,
      editButtonClass,
      editing,
      value,
      placeholder,
      onToggleEdit,
      onChange: unrested,
      ...other
    } = this.props;

    return (
      <div
        className={cx(classes.root, className)}
        ref={node => (this.container = node)}
        {...other}
      >
        <IconButton
          className={cx(classes.buttonEdit, editButtonClass)}
          icon={editing ? Icon.eye : Icon.pencil}
          tooltip={editing ? 'Preview' : 'Edit (Double Click)'}
          onClick={onToggleEdit}
        />

        {editing ? (
          <textarea
            className={classes.textarea}
            placeholder={placeholder}
            ref={node => (this.textarea = node)}
            value={value}
            onChange={this.onChange}
          />
        ) : (
          <Markdown source={value} />
        )}
      </div>
    );
  }
}
