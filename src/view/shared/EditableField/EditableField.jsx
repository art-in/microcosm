// @ts-nocheck

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import noop from 'utils/noop';

export default class EditableField extends Component {

    static propTypes = {
        tag: PropTypes.string,
        html: PropTypes.string,

        className: PropTypes.string,
        style: PropTypes.object,

        // should select all inner text when focused
        selectOnFocus: PropTypes.bool,
        // should be focused when mounted
        focusOnMount: PropTypes.bool,
        
        onChange: PropTypes.func.isRequired,
        onBlur: PropTypes.func
    }

    static defaultProps = {
        tag: 'div',
        selectOnFocus: true,
        focusOnMount: false,
        onBlur: noop
    }

    state = {
        html: ''
    }

    constructor(props) {
        super(props);

        this.state = {html: props.html};
        this.lastHtml = props.html;
    }

    componentDidMount() {
        if (this.props.focusOnMount) {
            this.input.focus();
        }
    }

    componentWillUnmount() {
        // unmount can happen before current input changes are saved.
        // because 'mousedown' outside happens before (!) 'blur' inside.
        // we need to ensure all changes are saved before unmount.
        this.emitChangeIfChanged();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.html !== this.input.innerHTML;
    }

    onBlur = () => {
        this.emitChangeIfChanged();
        this.props.onBlur();
    }

    onFocus = () => {
        if (this.props.selectOnFocus) {
            const node = this.input;
            const range = document.createRange();
            range.selectNodeContents(node);

            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    onKeyDown = e => {
        if (e.key === 'Enter' && !e.ctrlKey) {
            e.preventDefault();
            this.emitChangeIfChanged();
        }

        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            document.execCommand('insertHTML', false, '<br><br>');
        }

        e.stopPropagation();
    }

    onInput = () => {
        const html = this.input.innerHTML;
        this.setState({html});
    }

    emitChangeIfChanged = () => {
        const html = this.state.html;
        if (this.lastHtml !== html) {
            // emit change only if value was really changed
            this.props.onChange(html);
            this.lastHtml = html;
        }
    }

    render() {
        const {tag, ...other} = this.props;
        delete other.html;
        delete other.focusOnMount;
        delete other.selectOnFocus;
        delete other.onBlur;

        // do not use jsx here, to allow customizing element tag.
        // since many tags can be contenteditable (span, div, etc.)
        return React.createElement(tag, Object.assign({
            contentEditable: true,

            // contenteditable node can contain valid html inside,
            // like <br>, <b>, <i>, etc.
            dangerouslySetInnerHTML: {__html: this.state.html},
            ref: node => this.input = node,
            onBlur: this.onBlur,
            onFocus: this.onFocus,
            onKeyDown: this.onKeyDown,
            onInput: this.onInput
        }, {...other}));
    }

}