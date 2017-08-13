import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class EditableField extends Component {

    static propTypes = {
        tag: PropTypes.string,
        html: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        selectOnFocus: PropTypes.bool,
        focusOnMount: PropTypes.bool,
        onChange: PropTypes.func.isRequired,
        onReturn: PropTypes.func
    }

    static defaultProps = {
        tag: 'div',
        selectOnFocus: true,
        focusOnMount: false
    }

    state = {
        editHtml: ''
    }

    componentDidMount() {
        this.setState({
            editHtml: this.props.html
        });
        this.lastHtml = this.props.html;

        if (this.props.focusOnMount) {
            this.input.focus();
        }
    }

    componentWillUnmount() {
        this.emitChange();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.editHtml !== this.input.innerHTML;
    }

    onInput = () => {
        const html = this.input.innerHTML;
        this.setState({
            editHtml: html
        });
    }

    onFocus = () => {
        if (this.props.selectOnFocus) {
            setTimeout(() => {
                const node = this.input;
                const range = document.createRange();
                range.selectNodeContents(node);

                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }, 10);
        }
    }

    onKeyDown = e => {
        // 'Return'
        if (e.keyCode == 13 && !e.ctrlKey) {
            e.preventDefault();
            this.emitChange();
            this.props.onReturn && this.props.onReturn();
        }

        // 'Return + CTRL'
        if (e.keyCode == 13 && e.ctrlKey) {
            e.preventDefault();
            document.execCommand('insertHTML', false, '<br><br>');
        }

        e.stopPropagation();
    }

    emitChange = () => {
        const html = this.state.editHtml;
        if (this.lastHtml !== html) {
            this.props.onChange(html);
            this.lastHtml = html;
        }
    }

    render() {
        const {tag, ...other} = this.props;
        delete other.html;
        delete other.focusOnMount;
        delete other.selectOnFocus;

        return React.createElement(tag, Object.assign({
            contentEditable: true,
            dangerouslySetInnerHTML: {__html: this.state.editHtml},
            onInput: this.onInput,
            onFocus: this.onFocus,
            onKeyDown: this.onKeyDown,
            onBlur: this.emitChange,
            ref: node => this.input = node
        }, {...other}));
    }

}