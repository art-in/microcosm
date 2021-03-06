import readFileAsText from 'utils/read-file-as-text';

import StateType from 'boot/client/State';
import CancellationTokenType from 'action/utils/CancellationToken';

import NotebookType from './entities/NotebookType';
import ImportStatus from './entities/ImportStatus';
import ImportSourceType from './entities/ImportSource';
import ImportSourcesType from './entities/ImportSourceType';

import parseEvernoteNotes from './evernote/parse';
import mapNotes from './map-notes-to-ideas';

/**
 * Import ideas from other notebooks.
 *
 * @param {ImportSourceType} source
 * @param {StateType} state
 * @param {EventEmitter} events
 * @param {CancellationTokenType} [token]
 * @return {Promise.<MindsetDatabases|null>}
 */
export default async function importIdeas(source, state, events, token) {
  try {
    return await importIdeasInternal(source, state, events, token);
  } catch (e) {
    events.emit('status-change', ImportStatus.failed);
    throw e;
  }
}

/**
 * @param {ImportSourceType} source
 * @param {StateType} state
 * @param {EventEmitter} events
 * @param {CancellationTokenType} [token]
 * @return {Promise.<MindsetDatabases|null>}
 */
async function importIdeasInternal(source, state, events, token) {
  events.emit('status-change', ImportStatus.started);

  // load source data
  events.emit('status-change', ImportStatus.loading);
  let sourceData;
  switch (source.type) {
    case ImportSourcesType.text:
      sourceData = source.text;
      break;
    case ImportSourcesType.file:
      sourceData = await readFileAsText(source.file);
      break;
    default:
      throw Error(`Unknown source data type '${source.type}'`);
  }

  if (token && token.isCanceled) {
    events.emit('status-change', ImportStatus.canceled);
    return null;
  }

  // parse notes from source data
  events.emit('status-change', ImportStatus.parsing);
  let parseResult;
  switch (source.notebook) {
    case NotebookType.evernote: {
      parseResult = await parseEvernoteNotes(sourceData);
      break;
    }
    default:
      throw Error(`Unknown source notebook type '${source.notebook}'`);
  }

  if (parseResult.warnings.length) {
    events.emit('warn', parseResult.warnings);
  }

  if (token && token.isCanceled) {
    events.emit('status-change', ImportStatus.canceled);
    return null;
  }

  // map notes to ideas
  events.emit('status-change', ImportStatus.mapping);
  const mapResult = await mapNotes(parseResult.notes, state);

  if (mapResult.warnings.length) {
    events.emit('warn', mapResult.warnings);
  }

  if (token && token.isCanceled) {
    events.emit('status-change', ImportStatus.canceled);
    return null;
  }

  events.emit('status-change', ImportStatus.succeed);

  return mapResult.databases;
}
