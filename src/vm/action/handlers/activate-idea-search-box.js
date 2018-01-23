import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import showLookup from 'vm/shared/Lookup/methods/show-lookup';

/**
 * Activates idea search box
 *
 * @return {PatchType}
 */
export default function() {
  return view('update-idea-search-box', {
    active: true,
    lookup: {
      ...showLookup(),

      onPhraseChangeAction: ({phrase}) => ({
        type: 'search-ideas-for-search-box',
        data: {phrase}
      })
    }
  });
}
