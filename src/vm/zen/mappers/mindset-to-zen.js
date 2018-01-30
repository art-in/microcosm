import MindsetType from 'model/entities/Mindset';

import Zen from 'vm/zen/entities/Zen';
import openIdea from 'vm/zen/entities/Zen/methods/open-idea';

/**
 * Maps mindset model to zen view model
 *
 * @param {MindsetType} mindset
 * @return {Zen}
 */
export default function mindsetToZen(mindset) {
  const updateObject = openIdea({
    mindset,
    ideaId: mindset.root.id
  });
  return new Zen(updateObject);
}
