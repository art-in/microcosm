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
 * @prop {function()} onNeighborIdeaSelect
 * @prop {function()} onRemoveIdea
 * @prop {function()} onSuccessorCreate
 * @prop {function()} onSuccessorRemove
 * @prop {function()} onSuccessorSearchTriggerClick
 * @prop {function()} onSuccessorSearchLookupFocusOut
 * @prop {function()} onSuccessorSearchLookupPhraseChange
 * @prop {function()} onSuccessorSearchLookupKeyDown
 * @prop {function()} onSuccessorSearchLookupSuggestionSelect
 * @prop {function()} onClose
 * @prop {function()} onSave
 * @prop {function()} onCancel
 * 
 * @extends {Component<Props>}
 */
export default class IdeaFormModal extends Component {

    render() {
        const {
            className,
            ideaFormModal,
            onTitleChange,
            onValueChange,
            onValueToggleEdit,
            onValueDoubleClick,
            onNeighborIdeaSelect,
            onRemoveIdea,
            onSuccessorCreate,
            onSuccessorRemove,
            onSuccessorSearchTriggerClick,
            onSuccessorSearchLookupFocusOut,
            onSuccessorSearchLookupPhraseChange,
            onSuccessorSearchLookupKeyDown,
            onSuccessorSearchLookupSuggestionSelect,
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
                    valueEditButtonClass={classes.valueEditButton}
                    onTitleChange={onTitleChange}
                    onValueChange={onValueChange}
                    onValueToggleEdit={onValueToggleEdit}
                    onValueDoubleClick={onValueDoubleClick}
                    onNeighborIdeaSelect={onNeighborIdeaSelect}
                    onRemoveIdea={onRemoveIdea}
                    onSuccessorCreate={onSuccessorCreate}
                    onSuccessorRemove={onSuccessorRemove}
                    onSuccessorSearchTriggerClick=
                        {onSuccessorSearchTriggerClick}
                    onSuccessorSearchLookupFocusOut=
                        {onSuccessorSearchLookupFocusOut}
                    onSuccessorSearchLookupPhraseChange=
                        {onSuccessorSearchLookupPhraseChange}
                    onSuccessorSearchLookupKeyDown=
                        {onSuccessorSearchLookupKeyDown}
                    onSuccessorSearchLookupSuggestionSelect=
                        {onSuccessorSearchLookupSuggestionSelect}
                    onSave={onSave}
                    onCancel={onCancel} />
            </Modal>
        );
    }

}