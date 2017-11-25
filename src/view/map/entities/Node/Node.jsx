import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Point from 'model/entities/Point';
import NodeVM from 'vm/map/entities/Node';

import Group from 'view/shared/svg/Group';
import Circle from 'view/shared/svg/Circle';
import TextArea from 'view/shared/svg/TextArea';

import NodeDebug from '../NodeDebug';

import classes from './Node.css';

const TEXT_AREA_WIDTH = 200;
const TEXT_AREA_HEIGHT = 25;
const TEXT_AREA_POS = new Point({x: -100, y: -25});

export default class Node extends Component {

    static propTypes = {
        node: PropTypes.instanceOf(NodeVM).isRequired,
        className: PropTypes.string,
        
        onMouseDown: PropTypes.func.isRequired,
        onContextMenu: PropTypes.func.isRequired,

        onTitleDoubleClick: PropTypes.func.isRequired,
        onTitleBlur: PropTypes.func.isRequired,
        onTitleChange: PropTypes.func.isRequired
    }

    render() {
        
        const {
            node,
            className,
            onTitleDoubleClick,
            onTitleBlur,
            onTitleChange,
            onMouseDown,
            onContextMenu,
            ...other} = this.props;

        const gradientId = `node-gradient-${node.id}`;

        return (
            <Group
                className={cx(
                    classes.root, className,
                    {[classes.shaded]: node.shaded})}
                pos={node.posAbs}
                scale={node.scale}
                onMouseDown={onMouseDown}
                onContextMenu={onContextMenu}>

                <Circle className={classes.circle}
                    radius={node.radius}
                    fill={`url(#${gradientId})`}
                    {...other} />

                {
                    node.title.visible ?
                        <TextArea className={classes.title}
                            pos={TEXT_AREA_POS}
                            width={TEXT_AREA_WIDTH}
                            height={TEXT_AREA_HEIGHT}
                            value={node.title.value}
                            editable={node.title.editing}
                            onDoubleClick={onTitleDoubleClick}
                            onBlur={onTitleBlur}
                            onChange={onTitleChange} />
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