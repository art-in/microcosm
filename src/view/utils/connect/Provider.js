// @ts-nocheck

import {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * Provides store connection to all child components
 */
export default class Provider extends Component {
    
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        children: PropTypes.element
    }

    static childContextTypes = {
        dispatch: PropTypes.func.isRequired
    }

    getChildContext() {
        return {
            dispatch: this.props.dispatch
        };
    }

    render() {
        return this.props.children;
    }

}