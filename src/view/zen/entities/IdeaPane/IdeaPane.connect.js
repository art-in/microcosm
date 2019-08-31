import connect from 'view/utils/connect';
import Component from './IdeaPane.jsx';

export default connect(
  props => props.pane,
  dispatch => ({
    onTitleChange: ({title}) =>
      dispatch({
        type: 'on-zen-idea-form-title-change',
        data: {title}
      }),

    onValueChange: ({value}) =>
      dispatch({
        type: 'on-zen-idea-form-value-change',
        data: {value}
      }),

    onValueToggleEdit: () =>
      dispatch({
        type: 'on-zen-idea-form-value-toggle-edit'
      }),

    onValueDoubleClick: () =>
      dispatch({
        type: 'on-zen-idea-form-value-double-click'
      }),

    onNeighborIdeaSelect: ideaListItem =>
      dispatch({
        type: 'on-zen-idea-form-neighbor-idea-select',
        data: {ideaId: ideaListItem.id}
      }),

    onGearMenuToggle: () =>
      dispatch({
        type: 'on-zen-idea-form-gear-menu-toggle'
      }),

    onColorSelect: () =>
      dispatch({
        type: 'on-zen-idea-form-color-select'
      }),

    onColorRemove: () =>
      dispatch({
        type: 'on-zen-idea-form-color-remove'
      }),

    onRemove: () =>
      dispatch({
        type: 'on-zen-idea-form-remove'
      }),

    onSuccessorCreate: () =>
      dispatch({
        type: 'on-zen-idea-form-successor-create'
      }),

    onSuccessorRemove: ideaListItem =>
      dispatch({
        type: 'on-zen-idea-form-successor-remove',
        data: {ideaId: ideaListItem.id}
      }),

    onSuccessorSearchTriggerClick: () =>
      dispatch({
        type: 'zen-activate-idea-form-successor-search-box'
      }),
    onSuccessorSearchLookupFocusOut: () =>
      dispatch({
        type: 'on-zen-idea-form-successor-lookup-focusout'
      }),
    onSuccessorSearchLookupPhraseChange: data =>
      dispatch({
        type: 'on-zen-idea-form-successor-lookup-phrase-change',
        data
      }),
    onSuccessorSearchLookupKeyDown: data =>
      dispatch({
        type: 'on-zen-idea-form-successor-lookup-keydown',
        data
      }),
    onSuccessorSearchLookupSuggestionSelect: data =>
      dispatch({
        type: 'on-zen-idea-form-successor-lookup-suggestion-select',
        data
      }),

    onSave: () =>
      dispatch({
        type: 'on-zen-idea-form-save'
      }),

    onCancel: () =>
      dispatch({
        type: 'on-zen-idea-form-cancel'
      }),

    onScroll: () =>
      dispatch({
        type: 'on-zen-idea-form-scroll'
      }),

    onTitleFocusChange: data =>
      dispatch({
        type: 'on-zen-idea-form-title-focus-change',
        data
      })
  })
)(Component);
