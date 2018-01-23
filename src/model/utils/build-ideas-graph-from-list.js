import traverseGraph from 'utils/graph/traverse-graph';

import IdeaType from 'model/entities/Idea';
import AssociationType from 'model/entities/Association';

/**
 * Builds ideas object graph from adjacency list
 *
 * After extracting from storage, domain models only has IDs of related entities
 * In object graph each model has direct ref to related entity model,
 * eg. associations obtain references to corresponding from/to ideas
 *
 * Object graph is much performant for graph algorithms,
 * since you do not have to search entity lists each time when traversing graph
 *
 * @param {Array.<IdeaType>} ideas
 * @param {Array.<AssociationType>} associations
 * @return {IdeaType} root idea
 */
export default function(ideas, associations) {
  const isRoot = idea => idea.isRoot;

  let rootIdea = null;

  const visitedIdeas = new Set();

  if (associations.length === 0 && ideas.length === 1 && isRoot(ideas[0])) {
    // graph of single root idea
    rootIdea = ideas[0];
    rootIdea.edgesIn = [];
    rootIdea.edgesOut = [];

    return rootIdea;
  }

  associations.forEach(assoc => {
    // set head/tail idea to association
    const ideaHead = ideas.find(i => i.id === assoc.fromId);
    if (!ideaHead) {
      throw Error(
        `Head idea '${assoc.fromId}' ` +
          `of association '${assoc.id}' was not found`
      );
    }

    const ideaTail = ideas.find(i => i.id === assoc.toId);
    if (!ideaTail) {
      throw Error(
        `Tail idea '${assoc.toId}' ` +
          `of association '${assoc.id}' was not found`
      );
    }

    assoc.from = ideaHead;
    assoc.to = ideaTail;

    // mark visited ideas
    visitedIdeas.add(ideaHead);
    visitedIdeas.add(ideaTail);

    // init associations
    ideaHead.edgesIn = ideaHead.edgesIn || [];
    ideaTail.edgesIn = ideaTail.edgesIn || [];
    ideaHead.edgesOut = ideaHead.edgesOut || [];
    ideaTail.edgesOut = ideaTail.edgesOut || [];

    // add association to head idea as outgoing association
    ideaHead.edgesOut.push(assoc);

    // add association to tail idea as incoming association
    ideaTail.edgesIn.push(assoc);

    // mark root idea
    if (isRoot(ideaHead)) {
      rootIdea = ideaHead;
    }
  });

  // check root exists
  if (!rootIdea) {
    throw Error(`No root idea was found`);
  }

  // check all ideas can be reached from the root
  // TODO: this additional validational traversal can hit performance
  //       for big graphs
  visitedIdeas.clear();
  traverseGraph({
    root: rootIdea,
    visit: idea => {
      visitedIdeas.add(idea);
    }
  });

  const notVisitedIdeas = ideas
    .filter(n => !visitedIdeas.has(n))
    .map(n => n.id);

  if (notVisitedIdeas.length) {
    throw Error(
      `Some ideas cannot be reached from root: '` +
        `${notVisitedIdeas.join("', '")}'`
    );
  }

  return rootIdea;
}
