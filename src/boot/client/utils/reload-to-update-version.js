import debounce from 'debounce';

/**
 * Gets confirmation from user to reload page to apply new installed version.
 *
 * New version is considered to be installed when
 * - app cache (static files) updated
 * - or client config updated
 */
function reloadToUpdateVersion() {
  if (confirm('New version installed, reload now?')) {
    window.location.reload();
  }
}

// updates can happen same time, so we need to debounce it
export default debounce(reloadToUpdateVersion, 3000);
