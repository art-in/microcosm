import React, {Component} from 'react';
import cx from 'classnames';

import ImportFormModalVmType from 'vm/shared/ImportFormModal';
import Modal from 'view/shared/Modal';
import ImportForm from 'view/shared/ImportForm';

import classes from './ImportFormModal.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {ImportFormModalVmType} formModal
 *
 * @prop {function()} onClose
 * @prop {function({file: File})} onFileChange
 * @prop {function()} onImport
 *
 * @extends {Component<Props>}
 */
export default class ImportFormModal extends Component {
  render() {
    const {className, formModal, onClose, onFileChange, onImport} = this.props;

    return (
      <Modal
        className={cx(classes.root, className)}
        contentClass={classes.content}
        modal={formModal.modal}
        onClose={onClose}
      >
        <ImportForm
          form={formModal.form}
          onFileChange={onFileChange}
          onImport={onImport}
        />
      </Modal>
    );
  }
}
