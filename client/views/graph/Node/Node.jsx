import React, {Component, PropTypes} from 'react';
import cx from 'classnames';

import Point from 'client/viewmodels/misc/Point';
import NodeVM from 'client/viewmodels/graph/Node';

import Group from '../../svg/Group';
import Circle from '../../svg/Circle';
import TextArea from '../../svg/TextArea';
import Text from '../../svg/Text';

import classes from './Node.css';

export default class Node extends Component {

    static propTypes = {
        node: PropTypes.instanceOf(NodeVM).isRequired
    }

    render() {
        let {node, className, sheet, ...other} = this.props;
    let {round} = Math;

    let textAreaWidth = 200;
    let textAreaHeight = 25;
    let textAreaPos = new Point();
    textAreaPos.x = -(textAreaWidth / 2);
    textAreaPos.y = -(node.radius + textAreaHeight);

    return (
        <Group pos={ node.pos }>

            <Circle className={ cx(classes.node, className) }
                style={{ fill: node.color || 'lightgray' }}
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
                    onClick={ node.onTitleClick.bind(node) }
                    onBlur={ node.onTitleBlur.bind(node) }
                    onChange={ node.onTitleChange.bind(node) }/>
            }

            {
                node.debug &&
                <Text text={ `(${round(node.pos.x)} ${round(node.pos.y)})` }
                    className={ classes.debug }
                    transform={ `translate(-25 ${node.radius * 2})` }/>
            }

        </Group>
    );
  }

}