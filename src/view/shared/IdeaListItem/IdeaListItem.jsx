import React, {Component} from 'react';
import cx from 'classnames';
import icons from 'font-awesome/css/font-awesome.css';

import IdeaListItemType from 'vm/shared/IdeaListItem';

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
                    <div className={cx(
                        classes.removeButton,
                        icons.fa,
                        icons.faUnlink
                    )}
                    title='Remove association'
                    onClick={this.onRemove} />
                    : null
                }

            </div>
        );
    }

}