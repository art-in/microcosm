import connect from 'view/utils/connect';
import Component from './IdeaSearchBox.jsx';

export default connect(
    props => props.searchBox,
    dispatch => ({

        onTriggerClick: () => dispatch({
            type: 'on-idea-search-trigger-click'
        }),

        onLookupPhraseChange: ({phrase}) => dispatch({
            type: 'on-idea-search-lookup-phrase-change',
            data: {phrase}
        }),

        onLookupKeyDown: ({key}) => dispatch({
            type: 'on-idea-search-lookup-keydown',
            data: {key}
        }),

        onLookupSuggestionSelect: ({suggestion}) => dispatch({
            type: 'on-idea-search-lookup-suggestion-select',
            data: {suggestion}
        })

    })
)(Component);