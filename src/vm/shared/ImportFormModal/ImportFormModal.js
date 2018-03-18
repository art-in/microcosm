import initProps from 'utils/init-props';

import ViewModel from 'vm/utils/ViewModel';
import Modal from 'vm/shared/Modal';
import ImportForm from 'vm/shared/ImportForm';

/**
 * Import form inside modal popup
 */
export default class ImportFormModal extends ViewModel {
  /**
   * Modal popup
   */
  modal = new Modal();

  /**
   * Import form
   */
  form = new ImportForm();

  /**
   * Constructor
   * @param {Partial<ImportFormModal>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
