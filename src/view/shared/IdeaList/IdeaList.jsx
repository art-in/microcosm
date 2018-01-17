import React, {Component} from 'react';
import cx from 'classnames';

import IdeaListItemType from 'vm/shared/IdeaListItem';
import IdeaListItem from 'view/shared/IdeaListItem';

import classes from './IdeaList.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {Array.<IdeaListItemType>} ideas
 * @prop {function} onIdeaSelect
 * 
 * @extends {Component<Props>}
 */
export default class IdeaList extends Component {

    render() {
        const {className, ideas, onIdeaSelect} = this.props;

        // TODO: add 'add new association' button (association tails lookup)
        // TODO: add 'remove' button (save state only on form save)
        return (
            <div className={cx(classes.root, className)}>

                {ideas.map(i =>
                    <IdeaListItem key={i.id} idea={i}
                        onClick={onIdeaSelect.bind(this, i)}/>)}

            </div>
        );
    }

}