import MindsetType from "model/entities/Mindset";
import AssociationType from "model/entities/Association";

import getIdea from "./get-idea";
import getRootPath from "utils/graph/get-root-path";

/**
 * Gets path from root to target idea in string form
 *
 * @example
 * getIdeaRootPath(mindset, 'football id') // '/root/sports/football'
 *
 * @param {MindsetType} mindset
 * @param {string} ideaId
 * @return {string}
 */
export default function getIdeaRootPath(mindset, ideaId) {
  const idea = getIdea(mindset, ideaId);

  if (mindset.root === idea) {
    return "/" + idea.title;
  }

  /** @type {Array.<AssociationType>} */
  const path = getRootPath(mindset.root, idea);

  return `/${path.map(a => a.from.title).join("/")}/${idea.title}`;
}
