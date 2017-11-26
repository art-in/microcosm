/**
 * Calculates distance between two points
 * 
 * @param {Point} point1
 * @param {Point} point2
 * @return {number}
 */
export default function getDistanceBetweenPoints(point1, point2) {

    const {sqrt, pow} = Math;

    // calc distance with pythagorean theorem
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;

    return sqrt(pow(dx, 2) + pow(dy, 2));
}