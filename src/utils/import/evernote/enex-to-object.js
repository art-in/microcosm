import schema from 'joi-browser';
import camelcase from 'camelcase';

import parseXml from 'utils/parse-xml';

import enexSchema from './enex-schema';

/**
 * Converts Evernote Note Export Format 1.0 string to javascript object
 *
 * @param {string} enex
 * @return {Promise.<EnexObject>} enex object
 */
export default async function enexToObject(enex) {
  if (!enex) {
    throw Error('Received ENEX is empty');
  }

  // parse
  const obj = await parseXml(enex, {
    validator: (xpath, current, value) => {
      switch (xpath) {
        case '/enExport/note':
        case '/enExport/note/resource':
          // ensure element is always an array
          return !current && !Array.isArray(value) ? [value] : value;
        case '/enExport/note/resource/resourceAttributes':
          // ensure element is always an object
          return !current && typeof value !== 'object' ? {} : value;
        default:
          return value;
      }
    },

    // use camelcase, as typescript does not support hyphenated prop keys
    tagNameProcessor: name => camelcase(name)
  });

  // validate
  const result = schema.validate(obj, enexSchema, {
    // require only items specified in schema, ignore the rest
    presence: 'required',
    allowUnknown: true
  });

  if (result.error) {
    throw Error(result.error);
  }

  // @ts-ignore ignore typescript object key widening bug
  return obj;
}
