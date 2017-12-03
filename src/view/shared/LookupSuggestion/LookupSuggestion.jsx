import React, {Component} from 'react';
import cx from 'classnames';

import LookupSuggestionVmType from 'vm/shared/LookupSuggestion';

import classes from './LookupSuggestion.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {LookupSuggestionVmType} suggestion
 * @prop {boolean} [highlight]
 * @prop {function()} onSelected
 * 
 * @extends {Component<Props>}
 */
export default class LookupSuggestion extends Component {

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