import xml2js from 'xml2js';

/**
 * Parses XML string
 *
 * @param {string} xml
 * @param {object} opts
 * @param {function()} [opts.validator] - validate and change tag values
 * @param {function(string)} [opts.tagNameProcessor] - change tag names
 * @return {Promise.<Object<string, *>>}
 */
export default function parseXml(xml, opts) {
  const {validator, tagNameProcessor} = opts;

  const parser = new xml2js.Parser({
    attrkey: 'attributes',
    explicitArray: false,
    mergeAttrs: true,
    validator,
    tagNameProcessors: tagNameProcessor && [tagNameProcessor]
  });

  return new Promise((resolve, reject) =>
    parser.parseString(xml, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  );
}
