import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';
import view from 'vm/utils/view-patch';

/**
 * Handles file change event from import form modal
 *
 * @param {StateType} state
 * @param {object} data
 * @param {File} data.file
 * @return {PatchType}
 */
export default function(state, data) {
  const {file} = required(data);

  return view('update-import-form', {
    file: file || null,
    log: {entries: []},
    logIsShown: false,
    progressBar: {progress: 0},
    importButton: {enabled: Boolean(file)}
  });
}
