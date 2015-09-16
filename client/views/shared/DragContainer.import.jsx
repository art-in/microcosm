/**
 * Mixin for container with draggable items.
 *
 * Ext methods:
 * @param {func} onDragStep - called when position changed,
 *                            passes positions shift from previous drag step
 * @param {func} onDragCanceled - called when drag canceled, passes start position
 * @param {func} onDragged - called when drag finishes
 */
export default {
  getInitialState() {
    return {
      drag: {
        on: false,
        item: null,
        startX: null,
        startY: null,
        x: null,
        y: null
      }
    };
  },

  componentDidMount() {
    !this.onDragStep && console.warn('onDragStep is not defined');
    !this.onDragCanceled && console.warn('onDragCanceled is not defined');
    !this.onDragged && console.warn('onDragged is not defined');
  },

  onDragStart(item, startX, startY, e) {
    this.state.drag.on = true;
    this.state.drag.item = item;
    this.state.drag.startX = startX;
    this.state.drag.startY = startY;
    this.state.drag.x = e.clientX;
    this.state.drag.y = e.clientY;
  },

  onDragRevert(e) {
    if (!this.state.drag.on) {
      return;
    }

    this.state.drag.on = false;

    this.onDragCanceled && this.onDragCanceled(
      this.state.drag.item,
      this.state.drag.startX,
      this.state.drag.startY);
  },

  onDragStop() {
    if (!this.state.drag.on) {
      return;
    }

    this.state.drag.on = false;
    this.onDragged && this.onDragged(this.state.drag.item);
  },

  onDrag(e) {
    if (!this.state.drag.on) {
      return;
    }

    let shiftX = e.clientX - this.state.drag.x;
    let shiftY = e.clientY - this.state.drag.y;

    this.state.drag.x = e.clientX;
    this.state.drag.y = e.clientY;

    this.onDragStep && this.onDragStep(this.state.drag.item, shiftX, shiftY);
  }
}