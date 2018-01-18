import React, {Component} from 'react';
import cx from 'classnames';

import IdeaListItemType from 'vm/shared/IdeaListItem';

import classes from './IdeaListItem.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {IdeaListItemType} idea
 * @prop {function()} onClick
 * 
 * @extends {Component<Props>}
 */
export default class Idea extends Component {

    render() {
        const {className, idea, onClick} = this.props;

        // TODO: add idea color marker
        return (
            <div className={cx(classes.root, className)}
                onClick={onClick}>

                <span className={classes.title}>
                    {idea.title}
                </span>

                <span className={classes.rootPath}>
                    <span>
                        {idea.rootPath}
                    </span>
                </span>

            </div>
        );
    }

}