import MindsetType from 'model/entities/Mindset';
import IdeaFormType from 'vm/shared/IdeaForm';

import withoutItem from 'utils/get-array-without-item';

/**
 * Removes idea from list of successors
 * 
 * @param {IdeaFormType} form
 * @param {string} successorId 
 * @return {Partial<IdeaFormType>} update object
 */
export default function removeSuccessor(form, successorId) {
    
    const idx = form.successors.findIndex(i => i.id === successorId);
    const successors = withoutItem(form.successors, idx);

    return {
        successors,
        isSaveable: form.isTitleValid,
        isCancelable: !form.isNewIdea
    };
}