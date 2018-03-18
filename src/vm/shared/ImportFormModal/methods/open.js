import ImportFormModalType from 'vm/shared/ImportFormModal';
import openForm from 'vm/shared/ImportForm/methods/open';
import IdeaType from 'model/entities/Idea';

/**
 * Opens import form modal
 *
 * @param {IdeaType} targetIdea
 * @return {object}
 */
export default function open(targetIdea) {
  return {
    modal: {active: true},
    form: openForm(targetIdea)
  };
}
