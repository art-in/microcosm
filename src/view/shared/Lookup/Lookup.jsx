import React, {Component} from 'react';
import cx from 'classnames';

import noop from 'utils/noop';
import getKeyCode from 'view/utils/dom/get-key-code';

import LookupVmType from 'vm/shared/Lookup';
import LookupSuggestion from '../LookupSuggestion';

import classes from './Lookup.css';

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {LookupVmType} lookup
 * 
 * @prop {function()} [onFocusOut]
 * @prop {function({phrase})} onPhraseChange
 * @prop {function({code, preventDefault})} onKeyDown
 * @prop {function({suggestion})} onSuggestionSelect
 * 
 * @extends {Component<Props>}
 */
export default class Lookup extends Component {

    static defaultProps = {
        onFocusOut: noop
    }

    onPhraseChange = e => {
        const phrase = e.target.value;
        this.props.onPhraseChange({phrase});
    }

    componentDidMount() {
        this.ensureFocus();

        // react does not support focusin/focusout events, so need to subscribe
        // manually. 'blur' wont work because it does not bubble.
        this.container.addEventListener('focusout', this.onFocusOut);
    }

    componentDidUpdate() {
        this.ensureFocus();
    }

    componentWillUnmount() {
        this.container.removeEventListener('focusout', this.onFocusOut);
    }

    ensureFocus() {
        if (this.props.lookup.focused) {
            this.input.focus();
        }
    }

    onFocusOut = nativeEvent => {
        
        // make sure focus leaves lookup container and its children
        // (currently checking only container and input elements as nothing else
        // is focusable inside, but better solution is deep child check)
        // Q: why not listen to 'focusout' from input only?
        // A: because when selecting suggestions, 'focusout' on input triggers
        //    before 'click' on suggestion, and as a result suggestion list gets
        //    hidden before suggestion gets selected.
        if (nativeEvent.relatedTarget !== this.container &&
            nativeEvent.relatedTarget !== this.input) {
            this.props.onFocusOut();
        }
    }

    onKeyDown = e => {
        this.props.onKeyDown({
            code: getKeyCode(e.nativeEvent),
            preventDefault: e.preventDefault.bind(e)
        });
    }

    onSuggestionSelect(suggestionId) {
        const {lookup} = this.props;
        const suggestion = lookup.suggestions.find(s => s.id === suggestionId);
        this.props.onSuggestionSelect({suggestion});
    }

    render() {
        const {className, lookup} = this.props;
        const {
            highlightedSuggestionId: highlightId,
            placeholder,
            nothingFoundLabelShown
        } = lookup;

        return (
            <div className={cx(classes.root, className)}
                ref={node => this.container = node}
                // make sure focus stay in container when clicking suggestions,
                // so lookup does not get hidden too soon because of focus out
                tabIndex={0}>

                <input className={classes.input}
                    value={lookup.phrase}
                    ref={el => this.input = el}
                    placeholder={placeholder}
                    onChange={this.onPhraseChange}
                    onKeyDown={this.onKeyDown} />

                {lookup.suggestions.length ?
                    <div className={classes.suggestions}>
                        {lookup.suggestions.map(s =>
                            <LookupSuggestion
                                key={s.id}
                                suggestion={s}
                                className={classes.suggestion}
                                highlight={s.id === highlightId}
                                onSelected={this.onSuggestionSelect
                                    .bind(this, s.id)} />)}
                    </div> : null}

                {nothingFoundLabelShown ?
                    <div className={classes.nothingFound}>
                        Nothing found
                    </div> : null}
                
            </div>
        );
    }
}