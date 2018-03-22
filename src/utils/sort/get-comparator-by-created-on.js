import SortDirection from './sort-direction';

/**
 * Creates comparator to sort entities by creation time
 *
 * @typedef {object} CreatedOnObj
 * @prop {DateTimeISO} createdOn
 *
 * @param {SortDirection} direction
 * @return {function (CreatedOnObj, CreatedOnObj): -1|0|1} */
export default function getComparatorByCreatedOn(direction) {
  if (direction === SortDirection.asc) {
    return asc;
  } else {
    return desc;
  }
}

/**
 * @param {CreatedOnObj} objA
 * @param {CreatedOnObj} objB
 * @return {-1|0|1}
 */
function asc(objA, objB) {
  return objA.createdOn > objB.createdOn ? 1 : -1;
}

/**
 * @param {CreatedOnObj} objA
 * @param {CreatedOnObj} objB
 * @return {-1|0|1}
 */
function desc(objA, objB) {
  return objA.createdOn > objB.createdOn ? -1 : 1;
}
