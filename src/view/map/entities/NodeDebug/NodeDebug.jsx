// @ts-nocheck

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import round from 'utils/round';

import Group from 'view/shared/svg/Group';
import NodeVM from 'vm/map/entities/Node';
import Text from 'view/shared/svg/Text';
import Point from 'model/entities/Point';

import classes from './NodeDebug.css';

export default class NodeDebug extends Component {

    static propTypes = {
        className: PropTypes.string,
        node: PropTypes.instanceOf(NodeVM).isRequired
    }

    render() {
        const {className, node, ...other} = this.props;

        if (!node.debug) {
            return null;
        }

        const {posAbs, debugInfo: {posRel}} = node;

        const lines = [
            `id = ${node.id.slice(0, 5)}`,
            `scale = ${round(node.scale, 2)}`,
            `pos abs = [${round(posAbs.x)} x ${round(posAbs.y)}]`,
            `pos rel = [${round(posRel.x)} x ${round(posRel.y)}]`,
            `rpw = ${round(node.debugInfo.rootPathWeight, 2)}`
        ];

        // when node downscaled - upscale debug info back,
        // so it always stays normal size
        const scale = 1 / node.scale;

        return (
            <Group className={cx(classes.root, className)}
                {...other}
                scale={scale}>

                {lines.map((line, idx) =>
                    <Text text={line}
                        key={line}
                        className={classes.line}
                        pos={new Point({
                            x: -25,
                            y: node.radius + (10 / scale) + idx * 8
                        })}
                    />)}

            </Group>
        );
    }

}