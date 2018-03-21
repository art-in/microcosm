import moment from 'moment';

import Note from 'utils/import/entities/Note';

import enexToObject from 'utils/import/evernote/enex-to-object';
import enmlToMarkdown from 'utils/import/evernote/enml-to-markdown';
import nextTask from 'utils/next-task';

/**
 * Parses notes from Evernote export data (.enex)
 *
 * @param {string} enex
 * @return {Promise.<{notes:Array.<Note>, warnings:Array.<string>}>}
 */
export default async function parse(enex) {
  const enexObject = await enexToObject(enex);
  let warnings = [];

  const notes = [];

  for (const note of enexObject.enExport.note) {
    // split work between separate tasks, so in case we have a lot of notes,
    // mapping does not block task queue for long time.
    await nextTask();

    const res = enmlToMarkdown(note.content, note.resource);
    warnings = warnings.concat(
      res.warnings.map(w => `While parsing note "${note.title}": ${w}`)
    );

    const createdOn = note.created ? moment(note.created).toISOString() : null;

    notes.push(
      new Note({
        title: note.title,
        content: res.markdown,
        createdOn
      })
    );
  }

  return {notes, warnings};
}
