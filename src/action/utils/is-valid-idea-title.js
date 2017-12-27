export const IDEA_TITLE_MAX_LENGTH = 50;

/**
 * Checks whether idea title is valid
 * 
 * @param {string} title 
 * @return {boolean}
 */
export default function isValidIdeaTitle(title) {

    if (!title) {
        return false;
    }

    const trimmed = title.trim();

    return trimmed.length > 0 &&
        trimmed.length <= IDEA_TITLE_MAX_LENGTH;
}