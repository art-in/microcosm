import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Point from 'vm/shared/Point';
import NodeVM from 'vm/map/entities/Node';

import Group from 'view/shared/svg/Group';
import Circle from 'view/shared/svg/Circle';
import TextArea from 'view/shared/svg/TextArea';
import Text from 'view/shared/svg/Text';

import classes from './Node.css';

export default class Node extends Component {

    static propTypes = {
        node: PropTypes.instanceOf(NodeVM).isRequired,
        className: PropTypes.string
    }

    render() {
        
        const {node, className, ...other} = this.props;
        const {round} = Math;

        const textAreaWidth = 200;
        const textAreaHeight = 25;
        const textAreaPos = new Point();

        textAreaPos.x = -(textAreaWidth / 2);
        textAreaPos.y = -(node.radius + textAreaHeight);

        return (
            <Group pos={ node.pos } scale={ node.scale }>

                <Circle className={ cx(classes.root, className) }
                    style={{fill: node.color || 'lightgray'}}
                    radius={ node.radius }
                    {...other} />

                {
                    node.title.visible &&
                    <TextArea className={ classes.title }
                        pos={ textAreaPos }
                        width={ textAreaWidth }
                        height={ textAreaHeight }
                        value={ node.title.value }
                        editable={ node.title.editing }
                        onDoubleClick={ node.onTitleClick.bind(node) }
                        onBlur={ node.onTitleBlur.bind(node) }
                        onChange={ node.onTitleChange.bind(node) } />
                }

                {
                    node.debug &&
                    <Text text={ `(${round(node.pos.x)} ${round(node.pos.y)})` }
                        className={ classes.debug }
                        transform={`translate(` +
                            `-${node.radius + 10}` +
                            ` ${node.radius + 10})` }/>
                }

                {
                    node.debug &&
                    <Text text={ `depth = ${node.depth}` }
                        className={ classes.debug }
                        transform={`translate(` +
                            `-${node.radius + 10}` +
                            ` ${node.radius + 23})` }/>
                }

                {
                    node.debug &&
                    <Text text={ `scale = ${node.scale}` }
                        className={ classes.debug }
                        transform={`translate(` +
                            `-${node.radius + 10}` +
                            ` ${node.radius + 36})` }/>
                }

            </Group>
        );
    }

}