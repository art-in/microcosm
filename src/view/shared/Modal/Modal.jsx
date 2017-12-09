import React, {Component} from 'react';
import {CSSTransition} from 'react-transition-group';
import cx from 'classnames';

import ModalVmType from 'vm/shared/Modal';

import classes from './Modal.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {string} [contentClass]
 * @prop {ModalVmType} modal
 * 
 * @prop {function()} onClose
 * 
 * @extends {Component<Props>}
 */
export default class Modal extends Component {

    render() {
        const {
            className,
            contentClass,
            modal,
            children,
            onClose
        } = this.props;

        const transitionDuration = Number(classes.transitionDuration) * 1000;

        return (
            <CSSTransition
                in={modal.active}
                timeout={transitionDuration}
                mountOnEnter={true}
                unmountOnExit={true}
                classNames={classes.transition}>

                <div className={cx(classes.root, className)}>
                
                    <div className={classes.overlay}
                        ref={node => this.overlay = node}
                        onClick={onClose}>
                    </div>

                    <div className={cx(classes.content, contentClass)}>
                        <div className={classes.close}
                            onClick={onClose}>
                            close
                        </div>

                        {children}
                    </div>

                </div>

            </CSSTransition>
        );
    }

}