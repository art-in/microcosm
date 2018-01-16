import React, {Component} from 'react';
import {CSSTransition} from 'react-transition-group';
import cx from 'classnames';
import icons from 'font-awesome/css/font-awesome.css';

import ModalVmType from 'vm/shared/Modal';

import classes from './Modal.css';

// eslint-disable-next-line valid-jsdoc
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

    onBackingClick = e => {

        // backing is parent element for modal, so clicks from modal will also
        // bubble up, but we want to close only by clicks on backing itself
        if (e.target === this.backing) {
            this.props.onClose();
        }
    }

    render() {
        const {
            className,
            contentClass,
            modal,
            children,
            onClose
        } = this.props;

        const transitionDuration = Number(classes.transitionDuration) * 1000;

        // TODO: utilize html 5.2 dialog
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
        return (
            <CSSTransition
                in={modal.active}
                timeout={transitionDuration}
                mountOnEnter={true}
                unmountOnExit={true}
                classNames={classes.transition}>

                <div className={cx(classes.root, className)}
                    ref={node => this.backing = node}
                    onClick={this.onBackingClick}>
                
                    <div className={cx(classes.content, contentClass)}>
                        <div className={cx(
                            classes.close,
                            icons.fa,
                            icons.faClose
                        )}
                        title='Close (Esc)'
                        onClick={onClose}>
                        </div>

                        {children}
                    </div>

                </div>

            </CSSTransition>
        );
    }

}