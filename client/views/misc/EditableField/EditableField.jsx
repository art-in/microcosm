import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

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
            ReactDom.findDOMNode(this.refs.input).focus();
        }
    }

    componentWillUnmount() {
        this.emitChange();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.editHtml !== ReactDom.findDOMNode(this).innerHTML;
    }

    onInput = () => {
        var html = ReactDom.findDOMNode(this).innerHTML;
        this.setState({
            editHtml: html
        });
    }

    onFocus = () => {
        if (this.props.selectOnFocus) {
            setTimeout(() => {
                var node = ReactDom.findDOMNode(this);
                var range = document.createRange();
                range.selectNodeContents(node);

                var sel = window.getSelection();
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
        var html = this.state.editHtml;
        if (this.lastHtml !== html) {
            this.props.onChange(html);
            this.lastHtml = html;
        }
    }

    render() {
        let {tag, html, focusOnMount, selectOnFocus, ...other} = this.props;

        return React.createElement(tag, Object.assign({
            contentEditable: true,
            dangerouslySetInnerHTML: { __html: this.state.editHtml },
            onInput: this.onInput,
            onFocus: this.onFocus,
            onKeyDown: this.onKeyDown,
            onBlur: this.emitChange,
            ref: 'input'
        }, {...other}));
    }

}