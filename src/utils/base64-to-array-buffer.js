/**
 * Converts base64 string to array buffer.
 *
 * @param {string} base64
 * @return {ArrayBuffer}
 */
export default function base64ToArrayBuffer(base64) {
  // @ts-ignore string is a valid iterable
  return Uint8Array.from(base64, c => c.charCodeAt(0)).buffer;
}
