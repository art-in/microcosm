import MindsetType from 'model/entities/Mindset';

import IdeaFormType from 'vm/shared/IdeaForm';
import IdeaPane from 'vm/zen/entities/IdeaPane';
import openForm from 'vm/shared/IdeaForm/methods/open';
import openSidebar from 'vm/zen/entities/IdeaSidebar/methods/open';
import IdeaSidebarType from 'vm/zen/entities/IdeaSidebar/IdeaSidebar';
import shouldScrollTop from 'vm/action/utils/should-scroll-top-on-open-idea';

/**
 * Opens new or existing idea
 *
 * @param {object} opts
 * @param {MindsetType} opts.mindset
 * @param {boolean} [opts.isNewIdea  = false] - is creating new idea
 * @param {string} [opts.parentIdeaId] - ID of parent idea if creating new idea
 * @param {string} [opts.ideaId] - ID of existing idea
 * @param {IdeaFormType} [opts.prevForm] - prev form state
 * @return {{sidebar: Partial.<IdeaSidebarType>, pane: IdeaPane}} update object
 */
export default function openIdea(opts) {
  const {mindset, isNewIdea = false, parentIdeaId, ideaId, prevForm} = opts;

  // init sidebar
  const sidebar = openSidebar({
    mindset,
    isNewIdea,
    parentIdeaId,
    ideaId
  });

  // init idea pane
  const form = openForm({
    mindset,
    isNewIdea,
    parentIdeaId,
    ideaId
  });

  const pane = new IdeaPane({
    form,
    isScrolledTop: shouldScrollTop(ideaId, prevForm)
  });

  return {sidebar, pane};
}
