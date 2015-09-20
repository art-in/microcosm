import EventedViewModel from './shared/EventedViewModel';
import MindmapProxy from 'client/proxy/Mindmap';
import {mindmapToGraph} from 'client/mappers/mindmapMapper';
import ideaMapper from 'client/mappers/ideaMapper';
import GraphVM from './graph/Graph';

export default class Main extends EventedViewModel {

  static eventTypes() {
    return [
      'change'
    ];
  }

  constructor() {
    super();

    this.mindmap = new MindmapProxy();

    this.graph = new GraphVM();
  }

  load() {
    if (this.mindmap.load()) {
      this.graph = mindmapToGraph(this.mindmap);
      this.addGraphHandlers();
      return true;
    }

    this.graph = null;
    return false;
  }

  addGraphHandlers() {
    this.graph.on('nodeAdd', this.onNodeAdd.bind(this));
    this.graph.on('nodeChange', this.onNodeChange.bind(this));
    this.graph.on('nodeDelete', this.onNodeDelete.bind(this));
  }

  onNodeChange(node) {
    let idea = ideaMapper.nodeToIdea(node);
    this.mindmap.updateIdea({idea});
  }

  onNodeAdd(parentNode) {
    let parentIdea = ideaMapper.nodeToIdea(parentNode);
    this.mindmap.createIdea({parentIdeaId: parentIdea.id});
  }

  onNodeDelete(node) {
    let idea = ideaMapper.nodeToIdea(node);
    this.mindmap.deleteIdea({ideaId: idea.id});
  }

}