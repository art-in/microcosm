import Pointer from 'vm/utils/Pointer';

import toElementCoords from 'view/utils/dom/map-window-to-element-coords';
import mapPointerButtons from 'view/utils/map-pointer-buttons';

/**
 * Maps PointerEvent to pointer view model
 *
 * @param {PointerEvent} event
 * @return {Pointer}
 */
export default function mapPointer(event) {
  const pointer = new Pointer();

  pointer.id = event.pointerId;
  pointer.pos = toElementCoords(
    {x: event.clientX, y: event.clientY},
    // pointer position is calculated relative to the element handler was set on
    // @ts-ignore EventTarget is not castable to Element
    event.currentTarget
  );

  pointer.pressedButtons = mapPointerButtons(event.buttons);

  return pointer;
}
