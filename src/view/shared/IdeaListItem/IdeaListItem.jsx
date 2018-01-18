import React, {Component} from 'react';
import cx from 'classnames';

import IdeaListItemType from 'vm/shared/IdeaListItem';

import classes from './IdeaListItem.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {IdeaListItemType} item
 * @prop {'column'|'inline'} layout
 * @prop {function()} onClick
 * 
 * @extends {Component<Props>}
 */
export default class Idea extends Component {

    render() {
        const {className, item, layout, onClick} = this.props;

        // TODO: add idea color marker
        return (
            <div className={cx(classes.root, className, {
                [classes.layoutColumn]: layout === 'column',
                [classes.layoutInline]: layout === 'inline'
            })}
            style={{'--list-item-color': item.color}}
            title={item.tooltip}
            onClick={onClick}>

                <span className={classes.title}>
                    {item.title}
                </span>

                <span className={classes.rootPath}>
                    <span>
                        {item.rootPath}
                    </span>
                </span>

            </div>
        );
    }

}