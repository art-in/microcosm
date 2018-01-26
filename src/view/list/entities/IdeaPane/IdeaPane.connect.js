import connect from 'view/utils/connect';
import Component from './IdeaPane.jsx';

export default connect(
  props => props.pane,
  dispatch => ({
    onTitleChange: ({title}) =>
      dispatch({
        type: 'on-mindlist-idea-form-title-change',
        data: {title}
      }),

    onValueChange: ({value}) =>
      dispatch({
        type: 'on-mindlist-idea-form-value-change',
        data: {value}
      }),

    onValueToggleEdit: () =>
      dispatch({
        type: 'on-mindlist-idea-form-value-toggle-edit'
      }),

    onValueDoubleClick: () =>
      dispatch({
        type: 'on-mindlist-idea-form-value-double-click'
      }),

    onNeighborIdeaSelect: ideaListItem =>
      dispatch({
        type: 'on-mindlist-idea-form-neighbor-idea-select',
        data: {ideaId: ideaListItem.id}
      }),

    onGearMenuToggle: () =>
      dispatch({
        type: 'on-mindlist-idea-form-gear-menu-toggle'
      }),

    onColorSelect: () =>
      dispatch({
        type: 'on-mindlist-idea-form-color-select'
      }),

    onColorRemove: () =>
      dispatch({
        type: 'on-mindlist-idea-form-color-remove'
      }),

    onRemove: () =>
      dispatch({
        type: 'on-mindlist-idea-form-remove'
      }),

    onSuccessorCreate: () =>
      dispatch({
        type: 'on-mindlist-idea-form-successor-create'
      }),

    onSuccessorRemove: ideaListItem =>
      dispatch({
        type: 'on-mindlist-idea-form-successor-remove',
        data: {ideaId: ideaListItem.id}
      }),

    onSuccessorSearchTriggerClick: () =>
      dispatch({
        type: 'mindlist-activate-idea-form-successor-search-box'
      }),
    onSuccessorSearchLookupFocusOut: () =>
      dispatch({
        type: 'on-mindlist-idea-form-successor-lookup-focusout'
      }),
    onSuccessorSearchLookupPhraseChange: data =>
      dispatch({
        type: 'on-mindlist-idea-form-successor-lookup-phrase-change',
        data
      }),
    onSuccessorSearchLookupKeyDown: data =>
      dispatch({
        type: 'on-mindlist-idea-form-successor-lookup-keydown',
        data
      }),
    onSuccessorSearchLookupSuggestionSelect: data =>
      dispatch({
        type: 'on-mindlist-idea-form-successor-lookup-suggestion-select',
        data
      }),

    onSave: () =>
      dispatch({
        type: 'on-mindlist-idea-form-save'
      }),

    onCancel: () =>
      dispatch({
        type: 'on-mindlist-idea-form-cancel'
      })
  })
)(Component);
