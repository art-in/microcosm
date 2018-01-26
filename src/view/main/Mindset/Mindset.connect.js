import connect from 'view/utils/connect';
import Component from './Mindset.jsx';

export default connect(
  props => props.mindset,
  (dispatch, props) => ({
    onKeyDown: data =>
      dispatch({
        type: 'on-mindset-keydown',
        data,
        throttleLog: true
      }),

    onToggleMode: () => dispatch({type: 'on-mindset-toggle-mode'}),

    onGoRootButtonClick: () =>
      dispatch({type: 'on-mindset-go-root-button-click'}),

    onIdeaSearchTriggerClick: () =>
      dispatch({type: 'on-idea-search-trigger-click'}),

    onIdeaSearchLookupFocusOut: () =>
      dispatch({type: 'on-idea-search-lookup-focus-out'}),

    onIdeaSearchLookupPhraseChange: data =>
      dispatch({type: 'on-idea-search-lookup-phrase-change', data}),

    onIdeaSearchLookupKeyDown: data =>
      dispatch({type: 'on-idea-search-lookup-keydown', data}),

    onIdeaSearchLookupSuggestionSelect: data =>
      dispatch({type: 'on-idea-search-lookup-suggestion-select', data}),

    onColorPickerChange: ({color}) => {
      const picker = props.mindset.colorPicker;
      const action = picker.onSelectAction({color});
      dispatch(action);
    }
  })
)(Component);
