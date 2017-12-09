import React, {Component} from 'react';
import cx from 'classnames';

import IdeaFormModalVmType from 'vm/shared/IdeaFormModal';

import Modal from 'view/shared/Modal';
import IdeaForm from 'view/shared/IdeaForm';

import classes from './IdeaFormModal.css';

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {IdeaFormModalVmType} ideaFormModal
 * 
 * @prop {function()} onTitleChange
 * @prop {function()} onValueChange
 * @prop {function()} onValueToggleEdit
 * @prop {function()} onValueDoubleClick
 * @prop {function()} onClose
 * @prop {function()} onSave
 * @prop {function()} onCancel
 * 
 * @extends {Component<Props>}
 */
export default class IdeaFormModal extends Component {

    onKeyDown = e => {

        if (e.key === 'Escape') {
            this.props.onClose();
        }

        // do not propagate key shortcuts to graph (eg. arrows panning)
        e.stopPropagation();
    }

    render() {
        const {
            className,
            ideaFormModal,
            onTitleChange,
            onValueChange,
            onValueToggleEdit,
            onValueDoubleClick,
            onClose,
            onSave,
            onCancel
        } = this.props;

        return (
            <Modal className={cx(classes.root, className)}
                contentClass={classes.content}
                modal={ideaFormModal.modal}
                onClose={onClose}>

                <IdeaForm form={ideaFormModal.form}
                    onKeyDown={this.onKeyDown}
                    onTitleChange={onTitleChange}
                    onValueChange={onValueChange}
                    onValueToggleEdit={onValueToggleEdit}
                    onValueDoubleClick={onValueDoubleClick}
                    onSave={onSave}
                    onCancel={onCancel} />
            </Modal>
        );
    }

}