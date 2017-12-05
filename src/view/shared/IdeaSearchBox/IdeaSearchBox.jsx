import React, {Component} from 'react';
import cx from 'classnames';

import IdeaSearchBoxVmType from 'vm/shared/IdeaSearchBox';
import Lookup from 'view/shared/Lookup';

import classes from './IdeaSearchBox.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {IdeaSearchBoxVmType} searchBox
 * 
 * @prop {function()} onTriggerClick
 * @prop {function()} onLookupPhraseChange
 * @prop {function()} onLookupKeyDown
 * @prop {function()} onLookupSuggestionSelect
 * 
 * @extends {Component<Props>}
 */
export default class IdeaSearchBox extends Component {

    render() {
        const {
            className,
            searchBox,
            onTriggerClick,
            onLookupPhraseChange,
            onLookupKeyDown,
            onLookupSuggestionSelect
        } = this.props;

        return (
            <div className={cx(classes.root, className, {
                [classes.active]: searchBox.active
            })}>

                <span className={classes.trigger}
                    onClick={onTriggerClick}>
                    {/* TODO: set search icon */}
                    search
                </span>

                <span className={classes.lookupExpander}>
                    <Lookup className={classes.lookup}
                        lookup={searchBox.lookup}
                        onPhraseChange={onLookupPhraseChange}
                        onKeyDown={onLookupKeyDown}
                        onSuggestionSelect={onLookupSuggestionSelect} />
                </span>

            </div>
        );
    }

}