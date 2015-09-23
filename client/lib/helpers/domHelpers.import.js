export function getBodyMargin() {
  let bodyStyle = window.getComputedStyle(document.body, null);
  return {
    left: parseInt(bodyStyle.marginLeft),
    top: parseInt(bodyStyle.marginTop)
  };
}

export let bodyMargin;

document.addEventListener('DOMContentLoaded', function() {
  bodyMargin = getBodyMargin();
});

export default {
  getBodyMargin,
  bodyMargin
}