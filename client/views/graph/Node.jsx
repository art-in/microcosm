import React from 'react';
import cx from 'classnames';

import {createClassWithCSS} from 'client/lib/helpers/reactHelpers';

import DisplayNameAttribute from '../shared/DisplayNameAttribute';
import ViewModelComponent from 'client/views/shared/ViewModelComponent';
import Point from 'client/viewmodels/misc/Point';
import Node from 'client/viewmodels/graph/Node';
import Group from '../svg/Group';
import Circle from '../svg/Circle';
import TextArea from '../svg/TextArea';
import Text from '../svg/Text';

export default createClassWithCSS({

    displayName: 'Node',

    mixins: [DisplayNameAttribute, ViewModelComponent],

    propTypes: {
        node: React.PropTypes.instanceOf(Node).isRequired
    },

    getViewModel() {
        return { node: this.props.node };
    },

    css: {
        node: {
            'stroke': '#BBB',
            'stroke-width': '1'
        },
        title: {
            'font-size': '20px',
            'color': '#333',
            'text-align': 'center',
            'overflow': 'hidden',
            '&::selection:not([contenteditable])': {
                // do not select titles of nearby nodes when dragging over
                'background-color': 'inherit'
            },
            '&[contenteditable]': {
                'outline': '1px solid red'
            }
        },
        debug: {
            'font-size': '12px',
            'fill': '#D00',
            '&::selection': {
                'background-color': 'inherit'
            }
        }
    },

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

            <Circle className={ cx(this.css().node, className) }
                style={{ fill: node.color || 'lightgray' }}
                radius={ node.radius }
                {...other} />

            {
                node.title.visible &&
                <TextArea className={ this.css().title }
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
                    className={ this.css().debug }
                    transform={ `translate(-25 ${node.radius * 2})` }/>
            }

        </Group>
    );
  }

})