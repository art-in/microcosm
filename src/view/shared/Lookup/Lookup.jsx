import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import LookupVM from 'vm/shared/Lookup';
import LookupSuggestion from '../LookupSuggestion';

import classes from './Lookup.css';

export default class Lookup extends Component {

    static propTypes = {
        lookup: PropTypes.instanceOf(LookupVM).isRequired,
        className: PropTypes.string
    }

    onPhraseChange = e => {
        this.props.lookup.onPhraseChange(e.target.value);
    }

    componentDidMount() {
        this.props.lookup.onShown();
        this.ensureFocus();
    }

    componentWillUnmount() {
        this.props.lookup.onHidden();
    }

    componentDidUpdate() {
        this.ensureFocus();
    }

    ensureFocus() {
        if (this.props.lookup.focused) {
            this.input.focus();
        }
    }

    onKeyPress = e => {
        this.props.lookup.onKeyPress(e.key);

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
        }
    }

    render() {
        const {lookup, className} = this.props;
        const {
            highlightedSuggestionId: highlightId,
            onSuggestionSelected: onSelected,
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
                    onBlur={lookup.onBlur.bind(lookup)}
                    onKeyDown={this.onKeyPress} />

                {lookup.suggestions.length ?
                    <div className={classes.suggestions}>
                        {lookup.suggestions.map(s =>
                            <LookupSuggestion
                                key={s.id}
                                suggestion={s}
                                className={classes.suggestion}
                                highlight={s.id === highlightId}
                                onSelected={onSelected.bind(lookup, s.id)} />)}
                    </div> : null}

                {nothingFoundLabelShown ?
                    <div>
                        Nothing found
                    </div> : null}
                
            </div>
        );
    }
}