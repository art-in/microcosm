/**
 * Creates update object to stop graph dragging node
 * 
 * @return {object} graph update object
 */
export default function() {
    return {
        drag: {
            active: false,
            node: null,
            startX: null,
            startY: null
        }
    };
}