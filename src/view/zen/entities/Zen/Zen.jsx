import React, {Component} from 'react';
import cx from 'classnames';

import ZenType from 'vm/zen/entities/Zen';

import IdeaSidebar from 'view/zen/entities/IdeaSidebar';
import IdeaPane from 'view/zen/entities/IdeaPane';

import classes from './Zen.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {ZenType} zen
 *
 * @extends {Component<Props>}
 */
export default class Zen extends Component {
  render() {
    const {className, zen} = this.props;

    return (
      <div className={cx(classes.root, className)}>
        <IdeaSidebar className={classes.sidebar} sidebar={zen.sidebar} />
        <IdeaPane className={classes.pane} pane={zen.pane} />
      </div>
    );
  }
}
