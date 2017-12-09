import React, {Component} from 'react';
import cx from 'classnames';

import Point from 'model/entities/Point';
import NodeVmType from 'vm/map/entities/Node';

import Group from 'view/shared/svg/Group';
import Circle from 'view/shared/svg/Circle';
import Text from 'view/shared/svg/Text';

import NodeDebug from '../NodeDebug';

import classes from './Node.css';

const TEXT_AREA_POS = new Point({x: 0, y: -10});

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {NodeVmType} node
 * @prop {string} [className]
 * 
 * events
 * @prop {function()} onMouseDown
 * @prop {function()} onContextMenu
 * @prop {function()} onClick
 * 
 * @extends {Component<Props>}
 */
export default class Node extends Component {

    /** Indicates that mouse was moved after left button downed */
    mouseMovedAfterMouseDown = false;

    onMouseMove = e => {
        if (e.buttons === 1) {
            // mouse moved while holding left button.
            this.mouseMovedAfterMouseDown = true;
        }
    }

    onMouseUp = e => {

        if (e.button === 2) {
            // right mouse button should not initiate click
            return;
        }

        if (this.mouseMovedAfterMouseDown) {
            
            // only initiate click event when it is a clean click,
            // ie. after mouse is down - it is not moved there. otherwise
            // consider mouse-up as part of some other action on parent.
            // (eg. when dragging node subsequent mouse-up should not
            // be considered as click on the node, but as end of node dragging)
            this.mouseMovedAfterMouseDown = false;
            return;
        }

        this.props.onClick();
    }

    onClick = e => {
        // do not propagate click to graph to not disable idea form modal
        e.stopPropagation();
    }

    render() {
        
        const {
            node,
            className,
            onMouseDown,
            onContextMenu
        } = this.props;

        const gradientId = `node-gradient-${node.id}`;

        return (
            <Group
                className={cx(
                    classes.root, className,
                    {[classes.shaded]: node.shaded})}
                pos={node.posAbs}
                scale={node.scale}
                onMouseDown={onMouseDown}
                onMouseUp={this.onMouseUp}
                onMouseMove={this.onMouseMove}
                onClick={this.onClick}
                onContextMenu={onContextMenu}>

                <Circle className={classes.circle}
                    radius={node.radius}
                    fill={`url(#${gradientId})`}/>

                {
                    node.title.visible ?
                        <Text className={classes.title}
                            text={node.title.value}
                            align='middle'
                            pos={TEXT_AREA_POS} />
                        : null
                }

                <defs>
                    <radialGradient id={gradientId}>
                        <stop offset='10%' stopColor={node.color} />
                        <stop offset='95%' stopColor={node.color}
                            stopOpacity='0' />
                    </radialGradient>
                </defs>

                <NodeDebug node={node} />

            </Group>
        );
    }

}