// @ts-nocheck

import {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

/**
 * Renders children into a DOM node that exists outside the DOM hierarchy
 * of the parent component.
 * https://reactjs.org/docs/portals.html
 * 
 * This breaks normal component hierarchy, so should be used carefully.
 * 
 * Typically it solves rare visualization issues that cannot be solved by CSS,
 * but require changing DOM structure (popups and z-index), same time keeping
 * component structure the logical way.
 * 
 * Usecases (when to change DOM instead of CSS):
 * - 'break out' of parent container which has 'overflow: hidden'
 * - 'break out' of parent container which has lower z-index than other parents,
 *   so because of how css stacking context works - child cannot be set visually
 *   above other elements disregarding of how big its z-index is
 * - svg does not support z-index at all, putting element to bottom of DOM is
 *   the only way to render it above other elements
 */
export default class Portal extends Component {

    static propTypes = {
        rootId: PropTypes.string.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.arrayOf(PropTypes.element)
        ]).isRequired
    }

    constructor(props) {
        super(props);
        this.el = document.createElement('div');
    }
  
    componentDidMount() {
        const portalRoot = this.getPortalRoot();
        portalRoot.appendChild(this.el);
    }
  
    componentWillUnmount() {
        const portalRoot = this.getPortalRoot();
        portalRoot.removeChild(this.el);
    }

    getPortalRoot() {
        const portalRoot = document.getElementById(this.props.rootId);
        
        if (!portalRoot) {
            throw Error(
                `Portal container '${this.props.rootId}' was not found in DOM`);
        }

        return portalRoot;
    }
  
    render() {
        return ReactDOM.createPortal(
            this.props.children,
            this.el
        );
    }
}