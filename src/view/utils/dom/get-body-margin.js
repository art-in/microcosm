document.addEventListener('DOMContentLoaded', function() {
    // precache
    getBodyMargin();
});

/**
 * @typedef {object} MarginDef
 * @property {number} left
 * @property {number} top
 */

let cache = null;

/**
 * Gets body margin
 * @return {MarginDef}
 */
export default function getBodyMargin() {

    if (cache) {
        return cache;
    }

    const {marginLeft, marginTop} =
        window.getComputedStyle(document.body);

    if (marginLeft === null ||
        marginTop === null) {
        throw Error(`Invalid body margins '${marginLeft}, ${marginTop}'`);
    }

    cache = {
        left: parseInt(marginLeft, 10),
        top: parseInt(marginTop, 10)
    };

    return cache;
}