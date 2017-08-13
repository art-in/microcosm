import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import LinkVM from 'ui/viewmodels/graph/Link';
import Point from 'ui/viewmodels/misc/Point';

import Group from '../../svg/Group';
import Line from '../../svg/Line';
import TextArea from '../../svg/TextArea';

import classes from './Link.css';

export default class Link extends Component {

    static propTypes = {
        link: PropTypes.instanceOf(LinkVM).isRequired,
        className: PropTypes.string
    }

    onMouseDown = e => {
        // to not interfere with graph panning
        e.stopPropagation();
    }

    render() {
        const {link, className, ...other} = this.props;

        const titlePartOfLink = 0.75;
        const titleHeight = 25;
        const linkStartWidth = link.isBOI ? 30 : 5;
        const linkEndWidth = 2;

        // Using editable/rectangular TextArea for now.
        // It has rectangular form, which is OK since all links are lines now.
        // It cannot be drawn on (curl) paths, so compute positioning by hand.
        // This will not be required when we implement editable text area,
        // which can be drawn on (curl) paths.
        // For now it is just easier to compute positions
        // vs. implement curl editable field.
        const {sin, cos, atan2, sqrt, pow, max, PI} = Math;

        // flip title so it always above the link
        const reverseTitle = link.fromNode.pos.x > link.toNode.pos.x;

        const {posFrom, posTo} = {
            posFrom: reverseTitle ? link.toNode.pos : link.fromNode.pos,
            posTo: reverseTitle ? link.fromNode.pos : link.toNode.pos
        };

        const dx = posTo.x - posFrom.x;
        const dy = posTo.y - posFrom.y;
        const linkLength = sqrt(pow(dx, 2) + pow(dy, 2));

        // rotate title with the link
        const titleRotation = atan2(dy, dx) * 180 / PI;
        const titleWidth = linkLength * titlePartOfLink;
        const titlePos = new Point(posFrom.x, posFrom.y);

        // shift title to the center of the link
        titlePos.x += dx * (1 - titlePartOfLink) / 2;
        titlePos.y += dy * (1 - titlePartOfLink) / 2;

        // lift title above the link
        const titleLiftHeight = titleHeight
            + max(linkStartWidth, linkEndWidth) / 2;

        titlePos.x -= (-sin(titleRotation * (PI / 180)) * titleLiftHeight);
        titlePos.y -= (cos(titleRotation * (PI / 180)) * titleLiftHeight);

        return (
            <Group className={classes.root}>

                <Line id={ link.id }
                    className={ cx(classes.line, className) }
                    style={{fill: link.color || 'lightgray'}}
                    pos1={ link.fromNode.pos }
                    pos2={ link.toNode.pos }
                    width={{start: linkStartWidth, end: linkEndWidth}}
                    {...other} />

                {
                    link.title.visible &&
                    <TextArea className={ classes.title }
                        pos={ titlePos }
                        width={ titleWidth }
                        height={ titleHeight }
                        rotation={ titleRotation }
                        value={ link.title.value }
                        editable={ link.title.editing }
                        onClick={ link.onTitleClick.bind(link) }
                        onBlur={ link.onTitleBlur.bind(link) }
                        onChange={ link.onTitleChange.bind(link) }
                        onMouseDown= { this.onMouseDown } />
                }

            </Group>
        );
    }

}