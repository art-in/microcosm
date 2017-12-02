document.addEventListener('DOMContentLoaded', function() {
    // precache
    getBodyMargin();
});

let cache = null;

/**
 * Gets body margin
 * 
 * @typedef {object} Margin
 * @property {number} left
 * @property {number} top
 * 
 * @return {Margin}
 */
export default function getBodyMargin() {

    if (cache) {
        return cache;
    }

    const {marginLeft, marginTop} =
        window.getComputedStyle(document.body);

    if (marginLeft === null || marginTop === null) {
        throw Error(`Invalid body margins '${marginLeft}, ${marginTop}'`);
    }

    cache = {
        left: parseInt(marginLeft, 10),
        top: parseInt(marginTop, 10)
    };

    return cache;
}