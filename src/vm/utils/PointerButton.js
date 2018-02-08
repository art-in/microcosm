/**
 * Button of any pointer device (ie. mouse, pen, etc.)
 *
 * @typedef {number} PointerButton
 * @enum {number}
 */
const PointerButton = {
  // eg. the left button or the only button on single-button devices,
  // used to activate a user interface control or select text
  primary: 1,

  // eg. the right button, often used to display a context menu
  secondary: 2,

  // eg. the middle button, often combined with a mouse wheel
  auxiliary: 3
};

export default PointerButton;
