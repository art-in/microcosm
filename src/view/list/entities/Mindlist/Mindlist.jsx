import React, {Component} from 'react';
import cx from 'classnames';

import MindlistType from 'vm/list/entities/Mindlist';

import IdeaSidebar from 'view/list/entities/IdeaSidebar';
import IdeaPane from 'view/list/entities/IdeaPane';

import classes from './Mindlist.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {MindlistType} list
 *
 * @extends {Component<Props>}
 */
export default class Mindlist extends Component {
  render() {
    const {className, list} = this.props;

    return (
      <div className={cx(classes.root, className)}>
        <div className={classes.header} />
        <IdeaSidebar className={classes.sidebar} sidebar={list.sidebar} />
        <IdeaPane className={classes.pane} pane={list.pane} />
      </div>
    );
  }
}
