/**
 * Gets URL of server database
 *
 * @param {string} dbServerUrl
 * @param {string} userName
 * @param {string} dbName
 * @return {string}
 */
export default function getServerDbUrl(dbServerUrl, userName, dbName) {
  return `${dbServerUrl}/${userName}_${dbName}`;
}
