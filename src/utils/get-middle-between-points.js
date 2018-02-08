import assert from 'utils/assert';

import Point from 'model/entities/Point';
import isValidPosition from 'model/utils/is-valid-position';

/**
 * Gets middle position between two points
 *
 * @param {Point} pointA
 * @param {Point} pointB
 * @return {Point}
 */
export default function getMiddleBetweenPoints(pointA, pointB) {
  assert(isValidPosition(pointA), `Invalid position 1 '${pointA}'`);
  assert(isValidPosition(pointB), `Invalid position 2 '${pointB}'`);

  return new Point({
    x: (pointA.x + pointB.x) / 2,
    y: (pointA.y + pointB.y) / 2
  });
}
