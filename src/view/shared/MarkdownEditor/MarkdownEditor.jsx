import React, {Component} from 'react';
import cx from 'classnames';

import Markdown from 'view/shared/Markdown';

import classes from './MarkdownEditor.css';

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {string} [className]
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
    }

    componentDidUpdate() {
        if (this.props.editing) {
            // auto resize textarea to its contents, because by default
            // it auto-shrinks to small area with scroll.
            // unfortunately parent scroll will be resetted, because obviously
            // size gets adjasted after small area already drawn.
            this.textarea.style.height = this.textarea.scrollHeight + 'px';
        }
    }

    render() {
        const {
            className,
            editing,
            value,
            placeholder,
            onToggleEdit,
            onChange: unrested,
            ...other
        } = this.props;

        return (
            <div className={cx(classes.root, className)}
                {...other}>

                <div className={classes.buttonEdit}
                    onClick={onToggleEdit}>
                    edit
                </div>

                {editing ?
                    <textarea className={classes.textarea}
                        placeholder={placeholder}
                        ref={node => this.textarea = node}
                        value={value}
                        onChange={this.onChange} /> :
                    
                    <Markdown source={value} />}

            </div>
        );
    }

}