document.addEventListener('DOMContentLoaded', function() {
    // precache
    getBodyMargin();
});

/**
 * @typedef {object} MarginDef
 * @property {number} left
 * @property {number} top
 */

/**
 * Gets body margin
 * @return {MarginDef}
 */
export default function getBodyMargin() {
    // @ts-ignore
    if (getBodyMargin.cache) {
        // @ts-ignore
        return getBodyMargin.cache;
    }

    const bodyStyle = window.getComputedStyle(document.body, null);

    // @ts-ignore
    getBodyMargin.cache = {
        left: parseInt(bodyStyle.marginLeft, 10),
        top: parseInt(bodyStyle.marginTop, 10)
    };

    // @ts-ignore
    return getBodyMargin.cache;
}