import React, {Component} from 'react';
import cx from 'classnames';

import IdeaListItemType from 'vm/shared/IdeaListItem';
import Icon from 'vm/shared/Icon';

import IconButton from 'view/shared/IconButton';

import classes from './IdeaListItem.css';

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {IdeaListItemType} item
 * @prop {'column'|'inline'} layout
 * @prop {function()} onClick
 * @prop {function()} onRemove
 * 
 * @extends {Component<Props>}
 */
export default class Idea extends Component {

    onRemove = e => {
        this.props.onRemove();

        // do not bubble to not trigger click on container
        e.stopPropagation();
    }

    render() {
        const {className, item, layout, onClick} = this.props;

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

                {item.isRemovable ?
                    <IconButton className={classes.removeButton}
                        icon={Icon.unlink}
                        tooltip='Remove association'
                        onClick={this.onRemove} />
                    : null
                }

            </div>
        );
    }

}