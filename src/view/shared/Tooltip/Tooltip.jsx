import React, {Component} from 'react';
import {CSSTransition} from 'react-transition-group';
import cx from 'classnames';

import PointType from 'model/entities/Point';

import classes from './Tooltip.css';

// delay before starting transition to visible state
const DELAY = 500; // ms

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {object} [style]
 * @prop {PointType} [pos]
 * @prop {string} value
 * @prop {boolean} visible
 * 
 * @extends {Component<Props>}
 */
export default class Tooltip extends Component {

    static defaultProps = {
        value: ''
    }

    render() {

        const {className, value, visible, pos, style, ...other} = this.props;

        const styles = style || {};

        if (pos) {
            styles.left = `${pos.x}px`;
            styles.top = `${pos.y}px`;
        }

        return (
            <CSSTransition
                in={visible}
                timeout={{
                    enter: DELAY,

                    // Q: why do not transition on exit? 
                    // A: 1. this fixes tooltip random blinking while hovering
                    //       mouse quickly upon several parent elements.
                    //    2. will not work anyway since we clear view model
                    //       position same time as we set visibility to false.
                    exit: 0
                }}
                mountOnEnter={true}
                unmountOnExit={true}
                appear={true}
                classNames={classes.transition}>

                <div className={cx(classes.root, className)}
                    style={styles}
                    {...other}>
                    {value}
                </div>

            </CSSTransition>
        );
    }

}