import connect from 'view/utils/connect';
import Component from './IdeaFormModal.jsx';

export default connect(
    props => props.ideaFormModal,
    dispatch => ({

        onTitleChange: ({title}) => dispatch({
            type: 'on-idea-form-title-change',
            data: {title}
        }),

        onValueChange: ({value}) => dispatch({
            type: 'on-idea-form-value-change',
            data: {value}
        }),

        onValueToggleEdit: () => dispatch({
            type: 'on-idea-form-value-toggle-edit'
        }),

        onValueDoubleClick: () => dispatch({
            type: 'on-idea-form-value-double-click'
        }),

        onNeighborIdeaSelect: ideaListItem => dispatch({
            type: 'on-idea-form-modal-neighbor-idea-select',
            data: {ideaId: ideaListItem.id}
        }),

        onSuccessorRemove: ideaListItem => dispatch({
            type: 'on-idea-form-successor-remove',
            data: {ideaId: ideaListItem.id}
        }),

        onSuccessorSearchTriggerClick: () => dispatch({
            type: 'activate-idea-form-successor-search-box'
        }),
        onSuccessorSearchLookupFocusOut: () => dispatch({
            type: 'on-idea-form-successor-lookup-focusout'
        }),
        onSuccessorSearchLookupPhraseChange: data => dispatch({
            type: 'on-idea-form-successor-lookup-phrase-change',
            data
        }),
        onSuccessorSearchLookupKeyDown: data => dispatch({
            type: 'on-idea-form-successor-lookup-keydown',
            data
        }),
        onSuccessorSearchLookupSuggestionSelect: data => dispatch({
            type: 'on-idea-form-successor-lookup-suggestion-select',
            data
        }),

        onClose: () => dispatch({
            type: 'on-idea-form-modal-close'
        }),

        onSave: () => dispatch({
            type: 'on-idea-form-modal-save'
        }),

        onCancel: () => dispatch({
            type: 'on-idea-form-modal-cancel'
        })
        
    })
)(Component);