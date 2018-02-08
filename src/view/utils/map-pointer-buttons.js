import PointerButton from 'vm/utils/PointerButton';

/**
 * Maps state of PointerEvent#buttons to array of buttons
 * https://www.w3.org/TR/pointerevents/#button-states
 *
 * @param {number} pointerEventButtons
 * @return {Array.<PointerButton>}
 */
export default function mapPointerButtons(pointerEventButtons) {
  /** @type {Array.<PointerButton>} */
  const buttons = [];

  if (pointerEventButtons & 1) {
    buttons.push(PointerButton.primary);
  }

  if (pointerEventButtons & 2) {
    buttons.push(PointerButton.secondary);
  }

  if (pointerEventButtons & 4) {
    buttons.push(PointerButton.auxiliary);
  }

  return buttons;
}
