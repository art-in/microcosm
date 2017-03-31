import React, {Component, PropTypes} from 'react';
import cx from 'classnames';

import Point from 'ui/viewmodels/misc/Point';
import NodeVM from 'ui/viewmodels/graph/Node';

import Group from '../../svg/Group';
import Circle from '../../svg/Circle';
import TextArea from '../../svg/TextArea';
import Text from '../../svg/Text';

import classes from './Node.css';

export default class Node extends Component {

    static propTypes = {
        node: PropTypes.instanceOf(NodeVM).isRequired,
        className: PropTypes.string
    }

    onMouseDown = e => {
        // to not interfere with graph panning
        e.stopPropagation();
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
            <Group pos={ node.pos }>

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
                        onClick={ node.onTitleClick.bind(node) }
                        onBlur={ node.onTitleBlur.bind(node) }
                        onChange={ node.onTitleChange.bind(node) }
                        onMouseDown= { this.onMouseDown } />
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