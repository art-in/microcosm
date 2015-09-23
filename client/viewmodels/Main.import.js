import EventedViewModel from './shared/EventedViewModel';
import MindmapModel from 'models/Mindmap';
import Mindmap from './Mindmap';
import Graph from './graph/Graph';

export default class Main {

  constructor() {
    this.model = new MindmapModel();

    this.mindmap = null;
  }

  load() {
    if (this.model.load()) {
      this.mindmap = new Mindmap(this.model);
      this.addMindmapHandlers();
      return true;
    }

    return false;
  }

  addMindmapHandlers() {
    this.mindmap.on('ideaAdd', this.onIdeaAdd.bind(this));
    this.mindmap.on('ideaChange', this.onIdeaChange.bind(this));
    this.mindmap.on('ideaDelete', this.onIdeaDelete.bind(this));
    this.mindmap.on('assocChange', this.onAssocChange.bind(this));
  }

  onIdeaChange(idea) {
    this.model.updateIdea({idea});
  }

  onIdeaAdd(parentIdea) {
    this.model.createIdea({parentIdeaId: parentIdea.id});
  }

  onIdeaDelete(idea) {
    this.model.deleteIdea({ideaId: idea.id});
  }

  onAssocChange(assoc) {
    this.model.updateAssoc({assoc});
  }

}