import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Point from 'vm/shared/Point';
import NodeVM from 'vm/map/entities/Node';

import Group from 'view/shared/svg/Group';
import Circle from 'view/shared/svg/Circle';
import TextArea from 'view/shared/svg/TextArea';

import NodeDebug from '../NodeDebug';

import classes from './Node.css';

export default class Node extends Component {

    static propTypes = {
        node: PropTypes.instanceOf(NodeVM).isRequired,
        className: PropTypes.string
    }

    render() {
        
        const {node, className, ...other} = this.props;

        const textAreaWidth = 200;
        const textAreaHeight = 25;
        const textAreaPos = new Point();

        textAreaPos.x = -(textAreaWidth / 2);
        textAreaPos.y = -(node.radius + textAreaHeight);

        return (
            <Group
                className={cx(
                    classes.root, className,
                    {[classes.shaded]: node.shaded})}
                pos={node.pos}
                scale={node.scale}>

                <Circle className={classes.circle}
                    style={{fill: node.color || 'lightgray'}}
                    radius={ node.radius }
                    {...other} />

                {
                    node.title.visible ?
                        <TextArea className={ classes.title }
                            pos={ textAreaPos }
                            width={ textAreaWidth }
                            height={ textAreaHeight }
                            value={ node.title.value }
                            editable={ node.title.editing }
                            onDoubleClick={ node.onTitleClick.bind(node) }
                            onBlur={ node.onTitleBlur.bind(node) }
                            onChange={ node.onTitleChange.bind(node) } />
                        : null
                }

                <NodeDebug node={node} />

            </Group>
        );
    }

}