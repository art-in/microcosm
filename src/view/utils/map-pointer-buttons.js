import PointerButton from 'vm/utils/PointerButton';

/**
 * Maps state of MouseEvent#buttons to array of buttons
 * https://www.w3.org/TR/DOM-Level-3-Events/#dom-mouseevent-buttons
 *
 * @param {number} mouseEventButtons
 * @return {Array.<PointerButton>}
 */
export default function mapPointerButtons(mouseEventButtons) {
  /** @type {Array.<PointerButton>} */
  const buttons = [];

  if (mouseEventButtons & 1) {
    buttons.push(PointerButton.primary);
  }

  if (mouseEventButtons & 2) {
    buttons.push(PointerButton.secondary);
  }

  if (mouseEventButtons & 4) {
    buttons.push(PointerButton.auxiliary);
  }

  return buttons;
}
