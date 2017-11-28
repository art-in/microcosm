/**
 * Gets element size
 * @param {Element} el
 * @return {{width: number, height: number}}}
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