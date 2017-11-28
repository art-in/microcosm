import Point from 'model/entities/Point';

/**
 * Maps window (browser viewport) coordinates to coordinates on HTML element
 * Eg. pass svg element to map coordinates to svg viewport
 * 
 * @param {Point} windowPos - pos on browser viewport
 * @param {Element} element
 * @return {Point}
 */
export default function mapBrowserViewportToElementCoords(
    windowPos,
    element) {

    // get position relative to browser viewport
    const elRect = element.getBoundingClientRect();

    return new Point({
        x: windowPos.x - elRect.left,
        y: windowPos.y - elRect.top
    });
}