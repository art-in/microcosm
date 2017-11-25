import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import LinkVM from 'vm/map/entities/Link';
import Point from 'model/entities/Point';

import Group from 'view/shared/svg/Group';
import Line from 'view/shared/svg/Line';
import TextArea from 'view/shared/svg/TextArea';

import classes from './Link.css';

const GRADIENT_DENCITY_RATIO = 2000;
const ANIMATION_DURATION = 3; // sec

const LINE_WIDTH = 0.5;

export default class Link extends Component {

    static propTypes = {
        link: PropTypes.instanceOf(LinkVM).isRequired,
        className: PropTypes.string
    }

    getTitlePosition() {
        const {link} = this.props;
        
        // Text cannot be drawn on paths, so compute positioning by hand.
        const {sin, cos, atan2, sqrt, pow, max, PI} = Math;

        const titlePartOfLink = 0.75;
        const titleHeight = 25;
        const linkStartWidth = 10 * link.from.scale;
        const linkEndWidth = 2 * link.from.scale;

        // flip title so it always above the link
        const reverseTitle = link.from.posAbs.x > link.to.posAbs.x;

        const {posFrom, posTo} = {
            posFrom: reverseTitle ? link.to.posAbs : link.from.posAbs,
            posTo: reverseTitle ? link.from.posAbs : link.to.posAbs
        };

        const dx = posTo.x - posFrom.x;
        const dy = posTo.y - posFrom.y;

        const linkLength = sqrt(pow(dx, 2) + pow(dy, 2));

        const titleAngleDeg = atan2(dy, dx) * (180 / Math.PI);

        // rotate title with the link
        const titleWidth = linkLength * titlePartOfLink;
        const titlePos = new Point({x: posFrom.x, y: posFrom.y});

        // shift title to the center of the link
        titlePos.x += dx * (1 - titlePartOfLink) / 2;
        titlePos.y += dy * (1 - titlePartOfLink) / 2;

        // lift title above the link
        const titleLiftHeight = titleHeight
            + max(linkStartWidth, linkEndWidth) / 2;

        titlePos.x -= (-sin(titleAngleDeg * (PI / 180)) * titleLiftHeight);
        titlePos.y -= (cos(titleAngleDeg * (PI / 180)) * titleLiftHeight);

        return {
            titlePos,
            titleWidth,
            titleHeight,
            titleAngleDeg
        };
    }

    render() {
        const {link, className, ...other} = this.props;
        
        const {atan2, sqrt, pow} = Math;

        const {
            titlePos,
            titleWidth,
            titleHeight,
            titleAngleDeg
        } = this.getTitlePosition();

        const dx = link.to.posAbs.x - link.from.posAbs.x;
        const dy = link.to.posAbs.y - link.from.posAbs.y;

        const linkLength = sqrt(pow(dx, 2) + pow(dy, 2));
        const angleDeg = atan2(dy, dx) * (180 / Math.PI);
        const gradientDencity = GRADIENT_DENCITY_RATIO / linkLength;
        const gradientId = `link-gradient-${link.id}`;

        return (
            <Group className={cx(
                classes.root,
                {[classes.shaded]: link.shaded})}>

                <Line
                    className={cx(classes.line, className)}
                    pos1={link.from.posAbs}
                    pos2={link.to.posAbs}
                    width={LINE_WIDTH}
                    fill={`url(#${gradientId})`}
                    {...other} />

                {
                    link.title.visible ?
                        <TextArea className={classes.title}
                            pos={titlePos}
                            width={titleWidth}
                            height={titleHeight}
                            rotation={titleAngleDeg}
                            value={link.title.value}
                            editable={link.title.editing}
                            onDoubleClick={link.onTitleClick.bind(link)} />
                        : null
                }

                <defs>
                    <linearGradient id={gradientId}
                        gradientTransform={`rotate(${angleDeg})`}
                        spreadMethod='repeat'>
                    
                        <stop offset='0%' stopColor='rgba(0, 0, 0, 0)'/>
                        <stop offset='25%' stopColor={link.color} />
                        <stop offset='75%' stopColor={link.color} />
                        <stop offset='100%' stopColor='rgba(0, 0, 0, 0)'/>

                        <animate attributeName='x1'
                            from='0%'
                            to={`${gradientDencity / 2}%`}
                            dur={`${ANIMATION_DURATION}s`}
                            repeatCount='indefinite' />
                        
                        <animate attributeName='x2'
                            from={`${gradientDencity / 2}%`}
                            to={`${gradientDencity}%`}
                            dur={`${ANIMATION_DURATION}s`}
                            repeatCount='indefinite' />
                    </linearGradient>
                </defs>

            </Group>
        );
    }

}