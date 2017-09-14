document.addEventListener('DOMContentLoaded', function() {
    // precache
    getBodyMargin();
});

/**
 * Gets body margin
 * @return {{left: number, top: number}}}
 */
export default function getBodyMargin() {
    if (getBodyMargin.cache) {
        return getBodyMargin.cache;
    }

    const bodyStyle = window.getComputedStyle(document.body, null);
    getBodyMargin.cache = {
        left: parseInt(bodyStyle.marginLeft, 10),
        top: parseInt(bodyStyle.marginTop, 10)
    };

    return getBodyMargin.cache;
}