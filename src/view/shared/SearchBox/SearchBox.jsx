import React, {Component} from 'react';
import cx from 'classnames';
import icons from 'font-awesome/css/font-awesome.css';

import SearchBoxVmType from 'vm/shared/SearchBox';
import Lookup from 'view/shared/Lookup';
import IconType from 'vm/shared/Icon';

import classes from './SearchBox.css';
import mapIcon from 'view/utils/map-icon';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {SearchBoxVmType} searchBox
 * @prop {boolean} [expandToRight=false]
 * @prop {string} lookupClass
 * @prop {string} triggerClass
 * @prop {string} triggerTooltip
 * @prop {IconType} triggerIcon
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

    render() {
        const {
            className,
            searchBox,
            expandToRight,
            lookupClass,
            triggerClass,
            triggerTooltip,
            triggerIcon,
            onTriggerClick,
            onLookupFocusOut,
            onLookupPhraseChange,
            onLookupKeyDown,
            onLookupSuggestionSelect
        } = this.props;

        const trigger = (
            <span className={cx(
                classes.trigger,
                triggerClass,
                icons.fa,
                icons.faLg,
                mapIcon(triggerIcon).class
            )}
            title={triggerTooltip}
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