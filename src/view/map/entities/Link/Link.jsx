import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import LinkVM from 'vm/map/entities/Link';
import Point from 'model/entities/Point';

import Group from 'view/shared/svg/Group';
import Line from 'view/shared/svg/Line';
import TextArea from 'view/shared/svg/TextArea';
import Tooltip from 'view/shared/Tooltip';
import Portal from 'view/shared/Portal';

import classes from './Link.css';

const GRADIENT_DENCITY_RATIO = 2000;
const ANIMATION_DURATION = 3; // sec

const LINE_WIDTH = 0.5;

export default class Link extends Component {

    static propTypes = {
        className: PropTypes.string,
        link: PropTypes.instanceOf(LinkVM).isRequired,
        popupContainerId: PropTypes.string.isRequired,
        mapWindowToViewportCoords: PropTypes.func.isRequired,

        onMouseMove: PropTypes.func.isRequired,
        onMouseLeave: PropTypes.func.isRequired,
        onClick: PropTypes.func.isRequired
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

    onMouseMove = e => {
        const {mapWindowToViewportCoords} = this.props;

        const windowPos = new Point({x: e.clientX, y: e.clientY});
        const viewportPos = mapWindowToViewportCoords(windowPos);

        this.props.onMouseMove({viewportPos});
        e.stopPropagation();
    }

    onMouseLeave = e => {
        this.props.onMouseLeave();
        e.stopPropagation();
    }

    onMouseUp = e => {
        // do not bubble mouse-ups to Graph when link is clicked
        e.stopPropagation();
    }

    onClick = e => {
        const {mapWindowToViewportCoords} = this.props;

        const windowPos = new Point({x: e.clientX, y: e.clientY});
        const viewportPos = mapWindowToViewportCoords(windowPos);

        this.props.onClick({viewportPos});
        e.stopPropagation();
    }

    render() {
        const {
            link,
            className,
            popupContainerId
        } = this.props;

        const {highlighted, tooltip} = link;
    
        const {
            titlePos,
            titleWidth,
            titleHeight,
            titleAngleDeg
        } = this.getTitlePosition();

        const {atan2, sqrt, pow} = Math;

        const dx = link.to.posAbs.x - link.from.posAbs.x;
        const dy = link.to.posAbs.y - link.from.posAbs.y;

        const linkLength = sqrt(pow(dx, 2) + pow(dy, 2));
        const angleDeg = atan2(dy, dx) * (180 / Math.PI);
        const gradientDencity = GRADIENT_DENCITY_RATIO / linkLength;
        const gradientId = `link-gradient-${link.id}`;

        return (
            <Group
                className={cx(
                    classes.root,
                    {[classes.shaded]: link.shaded})}
                onMouseMove={this.onMouseMove}
                onMouseLeave={this.onMouseLeave}
                onMouseUp={this.onMouseUp}
                onClick={this.onClick}>

                <Line
                    className={cx(classes.line, className)}
                    pos1={link.from.posAbs}
                    pos2={link.to.posAbs}
                    width={LINE_WIDTH}
                    fill={highlighted ? link.color : `url(#${gradientId})`} />

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

                {tooltip.visible ?
                    <Portal rootId={popupContainerId}>
                        <Tooltip className={classes.tooltip}
                            value={tooltip.value}
                            style={{
                                left: `${tooltip.viewportPos.x}px`,
                                top: `${tooltip.viewportPos.y}px`
                            }}
                        />
                    </Portal>
                    : null
                }

                {
                    // Q: why not keep styling things like gradients in css?
                    // A: gradients for svg elements cannot be defined in css.
                    //    unfortunately structure should be mixed up with styles
                    //    this time
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