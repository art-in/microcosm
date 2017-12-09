import ViewModel from 'vm/utils/ViewModel';

import Modal from 'vm/shared/Modal';
import IdeaForm from 'vm/shared/IdeaForm';

/**
 * Idea form wrapped into modal popup
 */
export default class IdeaFormModal extends ViewModel {

    /**
     * Modal popup
     */
    modal = new Modal();

    /**
     * Idea form
     */
    form = new IdeaForm();

}