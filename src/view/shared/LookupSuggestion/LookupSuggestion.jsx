import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import LookupSuggestionVM from 'vm/shared/LookupSuggestion';

import classes from './LookupSuggestion.css';

export default class LookupSuggestion extends Component {

    static propTypes = {
        className: PropTypes.string,
        suggestion: PropTypes.instanceOf(LookupSuggestionVM).isRequired,
        highlight: PropTypes.bool,
        onSelected: PropTypes.func.isRequired
    }

    render() {
        const {suggestion, className, highlight, onSelected} = this.props;

        return (
            <div className={cx(classes.root, className, {
                [classes.highlight]: highlight
            })}
            onClick={onSelected}>

                {suggestion.displayName}

            </div>
        );
    }

}