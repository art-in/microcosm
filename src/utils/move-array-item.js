/**
 * Returns new array with target item moved to another position
 *
 * @param {array} array
 * @param {number} oldIdx
 * @param {number} newIdx
 * @return {array}
 */
export default function moveArrayItem(array, oldIdx, newIdx) {
  if (oldIdx === newIdx) {
    return array;
  }

  const a = Array.from(array);

  const item = a[oldIdx];

  a.splice(oldIdx, 1);
  a.splice(newIdx, 0, item);

  return a;
}
