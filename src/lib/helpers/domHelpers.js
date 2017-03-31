/**
 * Gets element size
 * @param {HtmlElement} el
 * @return {{width: number, height: number}}}
 */
export function getElementSize(el) {
    const rect = el.getBoundingClientRect();
    return {
        // SVG element size
        // https://github.com/jquery/jquery/issues/2889
        width: rect.width,
        height: rect.height
    };
}

/**
 * Gets body margin
 * @return {{left: number, top: number}}}
 */
export function getBodyMargin() {
    const bodyStyle = window.getComputedStyle(document.body, null);
    return {
        left: parseInt(bodyStyle.marginLeft, 10),
        top: parseInt(bodyStyle.marginTop, 10)
    };
}

export let bodyMargin;

document.addEventListener('DOMContentLoaded', function() {
    bodyMargin = getBodyMargin();
});

/**
 * Gets page scale
 * @return {number}
 */
export function getPageScale() {
    return window.outerWidth / window.innerWidth;
}