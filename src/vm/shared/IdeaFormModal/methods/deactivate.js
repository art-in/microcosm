/**
 * Deactivates form modal
 * 
 * @return {object} update object
 */
export default function() {
    return {
        modal: {
            active: false
        },
        form: {
            ideaId: null,
            parentIdeaId: null,
            isNewIdea: null
        }
    };
}