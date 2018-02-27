import React, {Component, Fragment} from 'react';

import MainVmType from 'vm/main/Main';
import MainScreen from 'vm/main/MainScreen';

import AuthScreen from 'view/auth/AuthScreen';
import Mindset from 'view/main/Mindset';
import Version from 'view/main/Version';
import MessageScreen from 'view/shared/MessageScreen';

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

    let screen;
    switch (mainVM.screen) {
      case MainScreen.loading:
        screen = <MessageScreen>Loading...</MessageScreen>;
        break;
      case MainScreen.auth:
        screen = <AuthScreen auth={mainVM.auth} />;
        break;
      case MainScreen.mindset:
        screen = <Mindset mindset={mainVM.mindset} />;
        break;
      default:
        throw Error(`Unknown screen type '${mainVM.screen}'`);
    }

    return (
      <Fragment>
        {screen}

        <Version className={classes.version} version={mainVM.version} />
      </Fragment>
    );
  }
}
