import {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * Provides store connection to all child components
 *
 * @typedef {object} Props
 * @prop {function()} dispatch
 * @prop {JSX.Element|Array.<JSX.Element>} [children]
 *
 * @typedef {object} ChildContext
 * @prop {function()} dispatch
 *
 * @extends {Component<Props>}
 */
export default class Provider extends Component {
  // run-time type checks of child context is required by react
  static childContextTypes = {
    dispatch: PropTypes.func.isRequired
  };

  /**
   * @return {ChildContext}
   */
  getChildContext() {
    return {
      dispatch: this.props.dispatch
    };
  }

  render() {
    return this.props.children;
  }
}
