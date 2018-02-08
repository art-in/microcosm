import assert from 'utils/assert';

import PointType from 'model/entities/Point';
import isValidPosition from 'model/utils/is-valid-position';

/**
 * Calculates distance between two points
 *
 * @param {PointType} pointA
 * @param {PointType} pointB
 * @return {number}
 */
export default function getDistanceBetweenPoints(pointA, pointB) {
  assert(isValidPosition(pointA), `Invalid position 1 '${pointA}'`);
  assert(isValidPosition(pointB), `Invalid position 2 '${pointB}'`);

  const {sqrt, pow} = Math;

  // calc distance with pythagorean theorem
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;

  return sqrt(pow(dx, 2) + pow(dy, 2));
}
