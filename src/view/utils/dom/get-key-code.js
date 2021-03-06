/**
 * Polyfills KeyboardEvent#code
 * https://www.w3.org/TR/DOM-Level-3-Events/#dom-keyboardevent-code
 *
 * TODO: remove when everybody supports it. currently no support for:
 * - Edge (code === undefined)
 * - Chrome for Android (code === empty string)
 *
 * @param {KeyboardEvent} event
 * @return {string}
 */
export default function(event) {
  let code = event.code;

  if (code === undefined || code === '') {
    switch (event.keyCode) {
      case 9:
        code = 'Tab';
        break;
      case 27:
        code = 'Escape';
        break;
      case 36:
        code = 'Home';
        break;
      case 37:
        code = 'ArrowLeft';
        break;
      case 38:
        code = 'ArrowUp';
        break;
      case 39:
        code = 'ArrowRight';
        break;
      case 40:
        code = 'ArrowDown';
        break;
      case 70:
        code = 'KeyF';
        break;
      default:
        code = event.key;
    }
  }

  return code;
}
