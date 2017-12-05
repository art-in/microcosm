import LookupType from 'vm/shared/Lookup';

/**
 * Clears lookup
 * 
 * @return {Partial<LookupType>} update object
 */
export default function clearLookup() {
    return {
        phrase: '',
        suggestions: [],
        nothingFoundLabelShown: false
    };
}