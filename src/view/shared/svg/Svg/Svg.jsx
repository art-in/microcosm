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

                // prevent drag-drop to not mess up with mouse down + move 
                // actions on child elements (eg. mindmap panning):
                // mouse down on any element inside or on empty area, move mouse
                // while mouse button pressed, sometimes (!) all text elements
                // inside become highlighted, ghost doc icon appear near cursor
                // just like when drag and drop images (Edge 41)
                onDragStart={e => e.preventDefault()}
                {...other}>

                { this.props.children }

            </svg>
        );
    }

}