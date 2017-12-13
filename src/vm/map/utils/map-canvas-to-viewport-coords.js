import PointType from 'model/entities/Point';

import toViewportCoords from './map-viewbox-to-viewport-coords';

/**
 * Maps canvas coordinates to viewport coordinates
 * 
 * @param {PointType} canvasPos - position on canvas
 * @param {object} viewbox - viewbox mapped to viewport
 * @return {PointType} viewport position
 */
export default function mapCanvasToViewport(canvasPos, viewbox) {

    const viewboxPos = {
        x: canvasPos.x - viewbox.x,
        y: canvasPos.y - viewbox.y
    };

    const viewportPos = toViewportCoords(viewboxPos, viewbox);

    return viewportPos;
}