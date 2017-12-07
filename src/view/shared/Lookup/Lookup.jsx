import React, {Component} from 'react';
import cx from 'classnames';

import LookupVmType from 'vm/shared/Lookup';
import LookupSuggestion from '../LookupSuggestion';

import classes from './Lookup.css';

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {LookupVmType} lookup
 * 
 * @prop {function({phrase})} onPhraseChange
 * @prop {function({key})} onKeyDown
 * @prop {function({suggestion})} onSuggestionSelect
 * 
 * @extends {Component<Props>}
 */
export default class Lookup extends Component {

    onPhraseChange = e => {
        const phrase = e.target.value;
        this.props.onPhraseChange({phrase});
    }

    componentDidMount() {
        this.ensureFocus();
    }

    componentDidUpdate() {
        this.ensureFocus();
    }

    ensureFocus() {
        if (this.props.lookup.focused) {
            this.input.focus();
        }
    }

    onKeyDown = e => {
        const key = e.key;
        this.props.onKeyDown({key});

        // is view too smart here
        if (key === 'ArrowDown' || key === 'ArrowUp') {
            // prevent default behavior of moving carret in the input
            e.preventDefault();
        }
    }

    onSuggestionSelect(suggestionId) {
        const {lookup} = this.props;
        const suggestion = lookup.suggestions.find(s => s.id === suggestionId);
        this.props.onSuggestionSelect({suggestion});
    }

    render() {
        const {lookup, className} = this.props;
        const {
            highlightedSuggestionId: highlightId,
            placeholder,
            nothingFoundLabelShown
        } = lookup;

        return (
            <div className={cx(classes.root, className)}>

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