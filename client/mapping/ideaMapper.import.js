export default {

  ideaToNode(idea) {
    return {
      id: idea._id,
      x: idea.x,
      y: idea.y
    };
  }

}