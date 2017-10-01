import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Group from 'view/shared/svg/Group';
import NodeVM from 'vm/map/entities/Node';
import Text from 'view/shared/svg/Text';

import classes from './NodeDebug.css';

export default class NodeDebug extends Component {

    static propTypes = {
        className: PropTypes.string,
        node: PropTypes.instanceOf(NodeVM).isRequired
    }

    render() {
        const {className, node, ...other} = this.props;
        const {round} = Math;

        if (!node.debug) {
            return null;
        }

        const lines = [
            `id = ${node.id.slice(0, 5)}`,
            `(${round(node.pos.x)} * ${round(node.pos.y)})`,
            `depth = ${node.depth}`,
            `scale = ${node.scale}`
        ];

        return (
            <Group className={cx(classes.root, className)}
                {...other}>

                {lines.map((line, idx) =>
                    <Text text={line}
                        key={line}
                        className={ classes.line }
                        transform={`translate(` +
                            `-${node.radius + 10}` +
                            ` ${node.radius + 10 + idx * 13})` } />)}

            </Group>
        );
    }

}