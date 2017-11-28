// @ts-nocheck

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import LookupVM from 'vm/shared/Lookup';
import LookupSuggestion from '../LookupSuggestion';

import classes from './Lookup.css';

export default class Lookup extends Component {

    static propTypes = {
        lookup: PropTypes.instanceOf(LookupVM).isRequired,
        className: PropTypes.string,
        
        onPhraseChange: PropTypes.func.isRequired,
        onKeyDown: PropTypes.func.isRequired,
        onSuggestionSelect: PropTypes.func.isRequired
    }

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
            e.preventDefault();
        }
    }

    render() {
        const {lookup, className} = this.props;
        const {onSuggestionSelect} = this.props;
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
                                onSelected={onSuggestionSelect
                                    .bind(null, {suggestion: s})} />)}
                    </div> : null}

                {nothingFoundLabelShown ?
                    <div className={classes['nothing-found']}>
                        Nothing found
                    </div> : null}
                
            </div>
        );
    }
}