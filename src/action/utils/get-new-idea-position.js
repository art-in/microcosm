import Point from 'model/entities/Point';

import getDistance from 'utils/get-distance-between-points';

// angle of full circle (2*PI radians or 360 degrees)
const FULL_CIRCLE_RAD = 2 * Math.PI;
const HALF_CIRCLE_RAD = FULL_CIRCLE_RAD / 2;

// angle step of circle observation
const ANGLE_STEP_RAD = FULL_CIRCLE_RAD / 36;

// distance step between observed circles
const RADIUS_STEP = 100;

// minimum distance from parent
const MIN_RADIUS = 500;

// minimum distance from already occupied positions
const MIN_DISTANCE_FROM_OCCUPIED_POSITIONS = 200;

/**
 * Gets relative position for new idea
 *
 * TODO: cover with unit tests when UX is manually approved
 *
 * @param {Point} parentRelPos - relative position of parent to grandparent
 * @param {Array.<Point>} occupiedPositions - already occupied positions
 * @param {number} parentScale - scale of parent
 * @return {Point}
 */
export default function getNewIdeaPosition(
  parentRelPos,
  occupiedPositions,
  parentScale
) {
  const minDistance = MIN_DISTANCE_FROM_OCCUPIED_POSITIONS * parentScale;
  const minRadius = MIN_RADIUS * parentScale;
  const radiusStep = RADIUS_STEP * parentScale;

  const isFreePos = isFreePosition.bind(null, occupiedPositions, minDistance);

  // start distributing ideas to the same direction as grandparent to parent,
  // so whole tree automatically tends to grow as a flower to every direction
  // from root in balanced way, and not to one particular direction (eg. left)
  const startingAngleRad = Math.atan2(parentRelPos.y, parentRelPos.x);

  let currentRadius = minRadius;
  let foundPos;

  // imperatively observe circles around parent idea to find free position
  while (!foundPos) {
    let relRad = 0;
    for (; relRad < HALF_CIRCLE_RAD; relRad += ANGLE_STEP_RAD) {
      // distribute ideas equally on both sides from starting direction
      const angleRad1 = startingAngleRad + relRad;
      const angleRad2 = startingAngleRad - relRad;

      if (
        (foundPos = isFreePos(currentRadius, angleRad1)) ||
        (foundPos = isFreePos(currentRadius, angleRad2))
      ) {
        break;
      }
    }

    // if there is no free place at this distance from parent,
    // try increase distance and check outer circle
    currentRadius += radiusStep;
  }

  return foundPos;
}

/**
 * Checks whether position at certain distance and direction from parent is free
 * to be occupied by new idea
 *
 * @param {Array.<Point>} occupiedPositions - already occupied positions
 * @param {number} minDistance - min distance from occupied positions
 * @param {number} radius - distance from parent
 * @param {number} angleRad - angle of direction from parent
 * @return {Point|undefined} free position, otherwise undefined
 */
function isFreePosition(occupiedPositions, minDistance, radius, angleRad) {
  const proposedPos = new Point({
    x: Math.cos(angleRad) * radius,
    y: Math.sin(angleRad) * radius
  });

  if (occupiedPositions.length) {
    // check proposed position is far enough from other occupied positions
    const farEnoughFromOccupiedPositions = occupiedPositions.every(
      occupiedPos => {
        const distance = getDistance(proposedPos, occupiedPos);
        return distance > minDistance;
      }
    );

    if (farEnoughFromOccupiedPositions) {
      return proposedPos;
    }
  } else {
    // no occupied positions means any position is free
    return proposedPos;
  }
}
