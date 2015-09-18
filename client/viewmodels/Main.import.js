import EventedViewModel from './shared/EventedViewModel';
import MindmapProxy from 'client/proxy/Mindmap';
import {mindmapToGraph} from 'client/mappers/mindmapMapper';
import MenuVM from 'client/viewmodels/misc/Menu';
import MenuItemVM from 'client/viewmodels/misc/MenuItem';
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

    this.contextMenu = {
      on: false,
      pos: null,
      node: null,
      def: new MenuVM([
        new MenuItemVM('add'),
        new MenuItemVM('delete')
      ])
    };

    this.addContextMenuHandlers();
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
    this.graph.on('nodeChange', this.onNodeChange.bind(this));
    this.graph.on('nodeAdd', this.onNodeAdd.bind(this));
    this.graph.on('nodeContextMenu', this.onNodeContextMenu.bind(this));
  }

  addContextMenuHandlers() {
    this.contextMenu.def.on('itemSelected',
      this.onNodeContextMenuClick.bind(this));
  }

  onNodeContextMenu(node, pos) {
    this.contextMenu.on = true;
    this.contextMenu.pos = pos;
    this.contextMenu.node = node;
    this.emit('change');
  }

  onGraphClick() {
    this.contextMenu.on = false;
    this.emit('change');
  }

  onNodeContextMenuClick(menuItem) {
    let node = this.contextMenu.node;

    switch (menuItem.displayValue) {
      case 'add': this.onNodeAdd(node); break;
      case 'delete': this.onNodeDelete(node); break;
    }
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