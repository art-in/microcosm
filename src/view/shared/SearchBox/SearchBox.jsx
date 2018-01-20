import React, {Component} from 'react';
import cx from 'classnames';

import SearchBoxVmType from 'vm/shared/SearchBox';
import IconType from 'vm/shared/Icon';
import IconSize from 'vm/shared/IconSize';

import Lookup from 'view/shared/Lookup';
import IconButton from 'view/shared/IconButton';

import classes from './SearchBox.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {SearchBoxVmType} searchBox
 * @prop {boolean} [expandToRight=false]
 * @prop {string} lookupClass
 * @prop {string} triggerClass
 * @prop {string} triggerTooltip
 * @prop {IconType} triggerIcon
 * @prop {IconSize} [triggerIconSize]
 * 
 * @prop {function()} onTriggerClick
 * @prop {function()} [onLookupFocusOut]
 * @prop {function()} onLookupPhraseChange
 * @prop {function()} onLookupKeyDown
 * @prop {function()} onLookupSuggestionSelect
 * 
 * @extends {Component<Props>}
 */
export default class SearchBox extends Component {

    static defaultProps = {
        triggerIconSize: IconSize.large
    }

    render() {
        const {
            className,
            searchBox,
            expandToRight,
            lookupClass,
            triggerClass,
            triggerTooltip,
            triggerIcon,
            triggerIconSize,
            onTriggerClick,
            onLookupFocusOut,
            onLookupPhraseChange,
            onLookupKeyDown,
            onLookupSuggestionSelect
        } = this.props;

        const trigger = (
            <IconButton
                className={cx(classes.trigger, triggerClass)}
                icon={triggerIcon}
                size={triggerIconSize}
                tooltip={triggerTooltip}
                onClick={onTriggerClick} />
        );

        return (
            <div className={cx(classes.root, className, {
                [classes.active]: searchBox.active
            })}>

                {!expandToRight ? trigger : null}

                <span className={classes.lookupExpander}>
                    <Lookup className={cx(classes.lookup, lookupClass)}
                        lookup={searchBox.lookup}
                        onFocusOut={onLookupFocusOut}
                        onPhraseChange={onLookupPhraseChange}
                        onKeyDown={onLookupKeyDown}
                        onSuggestionSelect={onLookupSuggestionSelect} />
                </span>

                {expandToRight ? trigger : null}

            </div>
        );
    }

}