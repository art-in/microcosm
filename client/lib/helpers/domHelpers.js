export function getElementSize(el) {
    let rect = el.getBoundingClientRect();
    return {
        // SVG element size
        // https://github.com/jquery/jquery/issues/2889
        width: rect.width,
        height: rect.height
    };
}

export function getBodyMargin() {
    let bodyStyle = window.getComputedStyle(document.body, null);
    return {
        left: parseInt(bodyStyle.marginLeft, 10),
        top: parseInt(bodyStyle.marginTop, 10)
    };
}

export let bodyMargin;

document.addEventListener('DOMContentLoaded', function() {
    bodyMargin = getBodyMargin();
});

export function getPageScale() {
    return window.outerWidth / window.innerWidth;
}
