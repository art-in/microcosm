/**
 * Rounds number
 *
 * @param {number} number
 * @param {number} [precision] - number of digits to save in fraction part
 * @return {number}
 */
export default function round(number, precision = 0) {
  const {pow, round} = Math;

  const divider = pow(10, precision);
  return round(number * divider) / divider;
}
