import Mindmap from './Mindmap';
import ApiAgent from 'client/lib/ApiAgent';

export default class Main {

  constructor() {
    this.apiAgent = new ApiAgent();

    this.mindmap = null;
  }

  //region publics

  load() {
    if (this.apiAgent.loadMindmap()) {

      this.mindmap = new Mindmap(this.apiAgent.mindmap);
      addMindmapHandlers.call(this);

      return true;
    }

    return false;
  }

  //endregion

}

//region privates

function addMindmapHandlers() {
  this.mindmap.on('ideaAdd', onIdeaAdd.bind(this));
  this.mindmap.on('ideaChange', onIdeaChange.bind(this));
  this.mindmap.on('ideaDelete', onIdeaDelete.bind(this));
  this.mindmap.on('assocChange', onAssocChange.bind(this));
  this.mindmap.on('mindmapChange', onMindmapChange.bind(this));
}

//endregion

//region handlers

function onIdeaAdd(parentIdea) {
  this.apiAgent.createIdea(parentIdea);
}

function onIdeaChange(idea) {
  this.apiAgent.updateIdea(idea);
}

function onIdeaDelete(idea) {
  this.apiAgent.deleteIdea(idea);
}

function onAssocChange(assoc) {
  this.apiAgent.updateAssoc(assoc);
}

function onMindmapChange(mindmap) {
  this.apiAgent.updateMindmap(mindmap);
}

//endregion