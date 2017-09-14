export let bodyMargin;

document.addEventListener('DOMContentLoaded', function() {
    bodyMargin = getBodyMargin();
});

/**
 * Gets body margin
 * @return {{left: number, top: number}}}
 */
export default function getBodyMargin() {
    const bodyStyle = window.getComputedStyle(document.body, null);
    return {
        left: parseInt(bodyStyle.marginLeft, 10),
        top: parseInt(bodyStyle.marginTop, 10)
    };
}