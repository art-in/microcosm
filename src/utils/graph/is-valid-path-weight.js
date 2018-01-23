/**
 * Checks whether path weight is valid
 *
 * @param {number} pathWeight - association weight or node root path weight
 * @return {boolean}
 */
export default function isValidPathWeight(pathWeight) {
  return (
    pathWeight !== undefined && Number.isFinite(pathWeight) && pathWeight >= 0
  );
}
