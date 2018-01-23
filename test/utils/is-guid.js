/**
 * Tests if string is valid GUID (UUID)
 * @param {string} str
 * @return {boolean}
 */
export default function isGUID(str) {
  return guidRegex.test(str);
}

// https://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
