/**
 * Creates update object to clear lookup
 * 
 * @return {object} lookup update object
 */
export default function() {
    return {
        phrase: '',
        suggestions: [],
        nothingFoundLabelShown: false
    };
}