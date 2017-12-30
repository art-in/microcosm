import React, {Component} from 'react';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {function()} nodeRef
 * @prop {Array.<JSX.Element>} children
 * @prop {string} [viewBox]
 * @prop {string} [preserveAspectRatio]
 * @prop {number} [tabIndex]
 * 
 * @prop {function()} [onMouseDown]
 * @prop {function()} [onMouseUp]
 * @prop {function()} [onMouseMove]
 * @prop {function()} [onMouseLeave]
 * @prop {function()} [onWheel]
 * @prop {function()} [onClick]
 * @prop {function()} [onContextMenu]
 * @prop {function()} [onKeyDown]
 * 
 * @extends {Component<Props>}
 */
export default class Svg extends Component {

    render() {

        const {nodeRef, className, ...other} = this.props;

        return (

            <svg className={className}
                ref={nodeRef}
                {...other}>

                { this.props.children }

            </svg>
        );
    }

}