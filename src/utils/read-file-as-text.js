/**
 * Reads file as text
 *
 * @param {File} file
 * @return {Promise.<string>}
 */
export default function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (reader.error) {
        reject(reader.error);
      } else {
        resolve(reader.result);
      }
    };

    reader.readAsText(file);
  });
}
