import PointerButton from 'vm/utils/PointerButton';

/**
 * Maps PointerEvent#button to PointerButton view model
 * https://www.w3.org/TR/pointerevents/#button-states
 *
 * @param {number} pointerEventButton
 * @return {PointerButton}
 */
export default function mapPointerButton(pointerEventButton) {
  switch (pointerEventButton) {
    case 0:
      return PointerButton.primary;
    case 1:
      return PointerButton.auxiliary;
    case 2:
      return PointerButton.secondary;
    default:
      throw Error(`Unknown pointer button '${pointerEventButton}'`);
  }
}
