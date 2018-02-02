import MindsetType from 'model/entities/Mindset';

import Zen from 'vm/zen/entities/Zen';
import IdeaSidebar from 'vm/zen/entities/IdeaSidebar';

import openIdea from 'vm/zen/entities/Zen/methods/open-idea';

/**
 * Maps mindset model to zen view model
 *
 * @param {MindsetType} mindset
 * @return {Zen}
 */
export default function mindsetToZen(mindset) {
  const {sidebar, pane} = openIdea({
    mindset,
    ideaId: mindset.focusIdeaId
  });

  return new Zen({
    sidebar: new IdeaSidebar(sidebar),
    pane
  });
}
