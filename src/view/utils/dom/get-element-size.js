/**
 * Gets element size
 * 
 * @typedef {object} Return
 * @property {number} width
 * @property {number} height
 * 
 * @param {Element} el
 * @return {Return}
 */
export default function getElementSize(el) {
    const rect = el.getBoundingClientRect();
    return {
        // SVG element size
        // https://github.com/jquery/jquery/issues/2889
        width: rect.width,
        height: rect.height
    };
}