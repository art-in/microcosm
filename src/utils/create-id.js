/**
 * Creates new random ID
 * @return {string}
 */
export default function createId() {
  let arr = new Array(24).fill(0);
  arr = arr.map(() => Math.floor(Math.random() * 10));
  const result = arr.join("");
  return result;
}
