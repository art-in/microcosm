import connect from 'view/utils/connect';
import Component from './Mindset.jsx';

export default connect(
  props => props.mindset,
  dispatch => ({
    onKeyDown: data =>
      dispatch({
        type: 'on-mindset-keydown',
        data,
        throttleLog: true
      }),

    onGoRootButtonClick: () =>
      dispatch({
        type: 'on-go-root-button-click'
      }),

    onIdeaSearchTriggerClick: () =>
      dispatch({
        type: 'on-idea-search-trigger-click'
      }),
    onIdeaSearchLookupPhraseChange: data =>
      dispatch({
        type: 'on-idea-search-lookup-phrase-change',
        data
      }),
    onIdeaSearchLookupKeyDown: data =>
      dispatch({
        type: 'on-idea-search-lookup-keydown',
        data
      }),
    onIdeaSearchLookupSuggestionSelect: data =>
      dispatch({
        type: 'on-idea-search-lookup-suggestion-select',
        data
      })
  })
)(Component);
