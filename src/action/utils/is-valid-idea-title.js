/**
 * Checks whether idea title is valid
 * 
 * TODO: set top limit for idea title length
 * TODO: validate for spaces only
 * 
 * @param {string} title 
 * @return {boolean}
 */
export default function isValidIdeaTitle(title) {

    if (!title) {
        return false;
    }

    return title.trim().length > 0;
}