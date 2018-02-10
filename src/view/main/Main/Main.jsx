import React, {Component, Fragment} from 'react';

import MainVmType from 'vm/main/Main';
import Mindset from 'view/main/Mindset';
import Version from 'view/main/Version';

import './shared/fonts.css';
import './shared/global.css';

import classes from './Main.css';

// root class should be set to root element when mounting main component,
// it allows to avoid rendering additional root element
export const rootClass = classes.root;

/**
 * @typedef {object} Props
 * @prop {MainVmType} main
 *
 * @extends {Component<Props>}
 */
export default class Main extends Component {
  render() {
    const {main: mainVM} = this.props;

    let pageComponent;
    switch (mainVM.screen) {
      case 'mindset':
        pageComponent = <Mindset mindset={mainVM.mindset} />;
        break;
      default:
        throw Error(`Unknown screen type '${mainVM.screen}'`);
    }

    return (
      <Fragment>
        {pageComponent}

        <Version className={classes.version} version={mainVM.version} />
      </Fragment>
    );
  }
}
