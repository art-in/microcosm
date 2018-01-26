import MindsetType from 'model/entities/Mindset';

import Mindlist from 'vm/list/entities/Mindlist';
import openIdea from 'vm/list/entities/Mindlist/methods/open-idea';

/**
 * Maps mindset model to mindlist view model
 *
 * @param {MindsetType} mindset
 * @return {Mindlist}
 */
export default function mindsetToMindlist(mindset) {
  const updateObject = openIdea({
    mindset,
    ideaId: mindset.root.id
  });
  return new Mindlist(updateObject);
}
