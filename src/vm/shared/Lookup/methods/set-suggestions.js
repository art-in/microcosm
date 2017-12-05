import LookupType from 'vm/shared/Lookup';
import LookupSuggestionType from 'vm/shared/LookupSuggestion';

/**
 * Sets suggestions to lookup
 * 
 * @param {Array.<LookupSuggestionType>} suggestions 
 * @return {Partial<LookupType>} update object
 */
export default function setSuggestions(suggestions) {

    // highlight first suggestion right away
    const highlightedSuggestionId =
        suggestions.length ? suggestions[0].id : null;

    return {
        suggestions,
        highlightedSuggestionId,
        loading: false,
        nothingFoundLabelShown: !suggestions.length
    };
}