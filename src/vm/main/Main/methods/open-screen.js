import MainScreen from 'vm/main/MainScreen';
import AuthScreen from 'vm/auth/AuthScreen';
import AuthScreenMode from 'vm/auth/AuthScreenMode';
import LoginForm from 'vm/auth/LoginForm';
import Mindset from 'vm/main/Mindset';
import MainType from 'vm/main/Main';

/**
 * Opens main screen
 *
 * @param {MainScreen} screen
 * @return {Partial.<MainType>}
 */
export default function openScreen(screen) {
  switch (screen) {
    case MainScreen.loading: {
      return {
        screen: MainScreen.loading,
        auth: null,
        mindset: null
      };
    }

    case MainScreen.auth: {
      return {
        screen: MainScreen.auth,
        auth: new AuthScreen({
          mode: AuthScreenMode.login,
          loginForm: new LoginForm()
        }),
        mindset: null
      };
    }

    case MainScreen.mindset: {
      return {
        screen: MainScreen.mindset,
        auth: null,
        mindset: new Mindset({
          isLoaded: false
        })
      };
    }

    default:
      throw Error(`Unknown screen type '${screen}'`);
  }
}
