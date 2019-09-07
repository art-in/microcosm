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
import ProgressBarStyle from 'vm/shared/ProgressBarStyle';
import CancellationTokenType from 'action/utils/CancellationToken';
import CancellationToken from 'action/utils/CancellationToken';

/**
 * Handles import event from import form modal
 *
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 * @param {function} mutate
 */
export default async function(state, data, dispatch, mutate) {
  const {
    vm: {
      main: {
        mindset: {
          importFormModal: {form}
        }
      }
    }
  } = state;

  await mutate(
    view('update-import-form', {
      inProgress: true,
      isInputEnabled: false,
      logIsShown: true,
      importButton: {enabled: false, content: 'Importing...'}
    })
  );

  // TODO: close modal by Esc key

  const source = new ImportSource({
    notebook: NotebookType.evernote,
    type: ImportSourceType.file,
    file: form.file
  });

  const token = new CancellationToken();
  await mutate(view('update-import-form', {token}));

  const events = new EventEmitter();
  subscribeToImportEvents(events, mutate, form, token);

  try {
    const databases = await importIdeas(source, state, events, token);

    if (token.isCanceled) {
      // import process was canceled by user
      return;
    }

    let logEntries = form.log.entries.concat([
      new LogEntry({
        time: new Date(),
        message: `Pushing new ideas to user mindset...`
      })
    ]);
    await mutate(view('update-import-form', {log: {entries: logEntries}}));

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
    await mutate(view('update-import-form', {log: {entries: logEntries}}));
  } catch (e) {
    const logEntries = form.log.entries.concat([
      new LogEntry({
        severity: LogEntrySeverity.error,
        message: e.toString()
      })
    ]);
    mutate(view('update-import-form', {log: {entries: logEntries}}));

    // re-throw error up, since we do not known error type here, and not sure if
    // it is an invalid import source or just bad code (eg. undefined is not a
    // function). in last case we need stacktrace in the console for debugging.
    throw e;
  } finally {
    await mutate(
      view('update-import-form', {
        inProgress: false,
        isInputEnabled: true,
        // keep import button disabled, to avoid importing same file again
        importButton: {enabled: false, content: 'Import'}
      })
    );
  }
}

/**
 * Subscribes to import events
 *
 * @param {EventEmitter} events
 * @param {function} mutate
 * @param {ImportFormType} form
 * @param {CancellationTokenType} token
 */
function subscribeToImportEvents(events, mutate, form, token) {
  let startedOn;

  events.on('status-change', status => {
    if (token.isCanceled) {
      // import was canceled by user
      return;
    }

    let message;
    const progressBar = {inProgress: true};
    switch (status) {
      case ImportStatus.started:
        message = 'Import started.';
        startedOn = moment();
        progressBar.progress = 0;
        progressBar.style = ProgressBarStyle.info;
        break;

      case ImportStatus.loading:
        message = 'Loading export data...';
        progressBar.progress = 25;
        break;

      case ImportStatus.parsing:
        message = 'Parsing notes...';
        progressBar.progress = 50;
        break;

      case ImportStatus.mapping:
        message = 'Mapping notes to ideas...';
        progressBar.progress = 75;
        break;

      case ImportStatus.failed: {
        progressBar.inProgress = false;
        progressBar.progress = 100;
        progressBar.style = ProgressBarStyle.error;
        const elapsedSec = moment
          .duration(moment().diff(startedOn))
          .as('seconds');
        message = `Import finished with error in ${elapsedSec}s.`;
        break;
      }

      case ImportStatus.succeed: {
        progressBar.inProgress = false;
        progressBar.progress = 100;

        // keep warn style if there were warnings
        const hasWarnings = form.progressBar.style === ProgressBarStyle.warning;
        progressBar.style = hasWarnings
          ? ProgressBarStyle.warning
          : ProgressBarStyle.success;
        const res = hasWarnings ? 'warnings' : 'success';

        const elapsedSec = moment
          .duration(moment().diff(startedOn))
          .as('seconds');
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
      view('update-import-form', {
        log: {entries: logEntries},
        progressBar
      })
    );
  });

  events.on('warn', warnings => {
    if (token.isCanceled) {
      // import was canceled by user
      return;
    }

    const logEntries = form.log.entries.concat(
      warnings.map(
        w => new LogEntry({severity: LogEntrySeverity.warning, message: w})
      )
    );
    mutate(
      view('update-import-form', {
        log: {entries: logEntries},
        progressBar: {style: ProgressBarStyle.warning}
      })
    );
  });
}
