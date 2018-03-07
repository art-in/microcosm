import {Component} from 'react';
import ReactDOM from 'react-dom';

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
 *
 * @typedef {object} Props
 * @prop {string} [tag=div]
 * @prop {string} rootId
 * @prop {JSX.Element|Array.<JSX.Element>} children
 *
 * @extends {Component<Props>}
 */
export default class Portal extends Component {
  static defaultProps = {
    tag: 'div'
  };

  constructor(props) {
    super(props);

    switch (props.tag) {
      case 'div':
        this.el = window.document.createElement(props.tag);
        break;
      case 'g':
        this.el = window.document.createElementNS(
          'http://www.w3.org/2000/svg',
          props.tag
        );
        break;
      default:
        throw Error(`Unknown container '${props.tag}'`);
    }
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
    const portalRoot = window.document.getElementById(this.props.rootId);

    if (!portalRoot) {
      throw Error(
        `Portal container '${this.props.rootId}' was not found in DOM`
      );
    }

    return portalRoot;
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}
