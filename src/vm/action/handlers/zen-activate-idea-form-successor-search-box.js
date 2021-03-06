import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

import showLookup from 'vm/shared/Lookup/methods/show-lookup';

/**
 * Activates successor search box in zen idea form
 *
 * @return {PatchType}
 */
export default function() {
  return view('update-zen-idea-form-successor-search-box', {
    active: true,
    lookup: {
      ...showLookup(),

      onPhraseChangeAction: ({phrase}) => ({
        type: 'search-ideas-for-zen-idea-form-successor-search-box',
        data: {phrase}
      })
    }
  });
}
