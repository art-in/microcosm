import {EventEmitter} from 'events';
import moment from 'moment';

import StateType from 'boot/client/State';
import Patch from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import importIdeas from 'utils/import/import-ideas';
import ImportStatus from 'utils/import/entities/ImportStatus';
import ImportSource from 'utils/import/entities/ImportSource';
import ImportSourceType from 'utils/import/entities/ImportSourceType';
import NotebookType from 'utils/import/entities/NotebookType';

import LogEntry from 'vm/shared/LogEntry';
import LogEntrySeverity from 'vm/shared/LogEntrySeverity';
import ImportFormType from 'vm/shared/ImportForm';

/**
 * Handles import event from import form modal
 *
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 * @param {function} mutate
 */
export default async function(state, data, dispatch, mutate) {
  const {vm: {main: {mindset: {importFormModal: {form}}}}} = state;

  // TODO: disable 'Import' button while file not selected or in progress
  // TODO: add progress bar
  // TODO: make tips and log section collapsable
  // TODO: confirm modal close while import in progress

  const importSource = new ImportSource({
    notebook: NotebookType.evernote,
    type: ImportSourceType.file,
    file: form.file
  });

  const events = new EventEmitter();
  subscribeToImportEvents(events, mutate, form);

  try {
    const databases = await importIdeas(importSource, state, events);

    let logEntries = form.log.entries.concat([
      new LogEntry({
        time: new Date(),
        message: `Pushing new ideas to user mindset...`
      })
    ]);
    await mutate(
      view('update-mindset-vm', {
        importFormModal: {form: {log: {entries: logEntries}}}
      })
    );

    // push imported ideas to current user mindset
    await mutate(
      new Patch({
        type: 'replicate-from-databases',
        data: databases,
        targets: ['data']
      })
    );

    await dispatch({
      type: 'load-mindset',
      data: {
        sessionDbServerUrl: state.data.dbServerUrl,
        sessionUserName: state.data.userName
      }
    });

    logEntries = form.log.entries.concat([
      new LogEntry({time: new Date(), message: 'Done.'})
    ]);
    await mutate(
      view('update-mindset-vm', {
        importFormModal: {form: {log: {entries: logEntries}}}
      })
    );
  } catch (e) {
    const logEntries = form.log.entries.concat([
      new LogEntry({
        severity: LogEntrySeverity.error,
        message: e.toString()
      })
    ]);
    mutate(
      view('update-mindset-vm', {
        importFormModal: {form: {log: {entries: logEntries}}}
      })
    );

    // re-throw error up, since we do not known error type here, and not sure if
    // it is an invalid import source or just bad code (eg. undefined is not a
    // function). in last case we need stacktrace in the console for debugging.
    throw e;
  }
}

/**
 * Subscribes to import events
 *
 * @param {EventEmitter} events
 * @param {function} mutate
 * @param {ImportFormType} form
 */
function subscribeToImportEvents(events, mutate, form) {
  let startedOn;

  events.on('status-change', status => {
    let message;
    switch (status) {
      case ImportStatus.started:
        message = 'Import started.';
        startedOn = moment();
        break;
      case ImportStatus.loading:
        message = 'Loading export data...';
        break;
      case ImportStatus.parsing:
        message = 'Parsing notes...';
        break;
      case ImportStatus.mapping:
        message = 'Mapping notes to ideas...';
        break;
      case ImportStatus.failed:
      case ImportStatus.succeed: {
        const elapsedSec = moment
          .duration(moment().diff(startedOn))
          .as('seconds');
        const res = status === ImportStatus.succeed ? 'success' : 'error';
        message = `Import finished with ${res} in ${elapsedSec}s.`;
        break;
      }
      default:
        throw Error(`Unknown import status '${status}'`);
    }

    const logEntries = form.log.entries.concat([
      new LogEntry({time: new Date(), message})
    ]);
    mutate(
      view('update-mindset-vm', {
        importFormModal: {form: {log: {entries: logEntries}}}
      })
    );
  });

  events.on('warn', warnings => {
    const logEntries = form.log.entries.concat(
      warnings.map(
        w => new LogEntry({severity: LogEntrySeverity.warning, message: w})
      )
    );
    mutate(
      view('update-mindset-vm', {
        importFormModal: {form: {log: {entries: logEntries}}}
      })
    );
  });
}
