import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import LinkVM from 'vm/map/entities/Link';
import Point from 'model/entities/Point';

import Group from 'view/shared/svg/Group';
import Line from 'view/shared/svg/Line';
import TextArea from 'view/shared/svg/TextArea';

import classes from './Link.css';

export default class Link extends Component {

    static propTypes = {
        link: PropTypes.instanceOf(LinkVM).isRequired,
        className: PropTypes.string
    }

    render() {
        const {link, className, ...other} = this.props;
        
        const titlePartOfLink = 0.75;
        const titleHeight = 25;
        const linkStartWidth = 10 * link.from.scale;
        const linkEndWidth = 2 * link.from.scale;
        
        // Using editable/rectangular TextArea for now.
        // It has rectangular form, which is OK since all links are lines now.
        // It cannot be drawn on (curl) paths, so compute positioning by hand.
        // This will not be required when we implement editable text area,
        // which can be drawn on (curl) paths.
        // For now it is just easier to compute positions
        // vs. implement curl editable field.
        const {sin, cos, atan2, sqrt, pow, max, PI} = Math;

        // flip title so it always above the link
        const reverseTitle = link.from.pos.x > link.to.pos.x;

        const {posFrom, posTo} = {
            posFrom: reverseTitle ? link.to.pos : link.from.pos,
            posTo: reverseTitle ? link.from.pos : link.to.pos
        };

        const dx = posTo.x - posFrom.x;
        const dy = posTo.y - posFrom.y;
        const linkLength = sqrt(pow(dx, 2) + pow(dy, 2));

        // rotate title with the link
        const titleRotation = atan2(dy, dx) * 180 / PI;
        const titleWidth = linkLength * titlePartOfLink;
        const titlePos = new Point({x: posFrom.x, y: posFrom.y});

        // shift title to the center of the link
        titlePos.x += dx * (1 - titlePartOfLink) / 2;
        titlePos.y += dy * (1 - titlePartOfLink) / 2;

        // lift title above the link
        const titleLiftHeight = titleHeight
            + max(linkStartWidth, linkEndWidth) / 2;

        titlePos.x -= (-sin(titleRotation * (PI / 180)) * titleLiftHeight);
        titlePos.y -= (cos(titleRotation * (PI / 180)) * titleLiftHeight);

        return (
            <Group className={cx(
                classes.root,
                {[classes.shaded]: link.shaded})}>

                <Line id={ link.id }
                    className={ cx(classes.line, className) }
                    style={{fill: link.color}}
                    pos1={ link.from.pos }
                    pos2={ link.to.pos }
                    width={{start: linkStartWidth, end: linkEndWidth}}
                    {...other} />

                {
                    link.title.visible ?
                        <TextArea className={ classes.title }
                            pos={ titlePos }
                            width={ titleWidth }
                            height={ titleHeight }
                            rotation={ titleRotation }
                            value={ link.title.value }
                            editable={ link.title.editing }
                            onDoubleClick={ link.onTitleClick.bind(link) } />
                        : null
                }

            </Group>
        );
    }

}