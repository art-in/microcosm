import EventedViewModel from './shared/EventedViewModel';
import ColorPicker from './misc/ColorPicker';
import ContextMenu from './misc/ContextMenu';
import MenuItem from './misc/MenuItem';
import {mindmapToGraph as toGraph, graphToMindmap as toMindmap} from 'client/mappers/graphMapper';
import ideaMapper from 'client/mappers/nodeMapper';
import {nodeToIdea as toIdea} from 'client/mappers/nodeMapper';
import {linkToAssoc as toAssoc} from 'client/mappers/linkMapper';
import Graph from './graph/Graph';
import Link from './graph/Link';

const model_ = new WeakMap();

export default class Mindmap extends EventedViewModel {

  static eventTypes() {
    return [
      'change',
      'ideaAdd',
      'ideaChange',
      'ideaDelete',
      'assocChange',
      'mindmapChange'
    ];
  }

  constructor(model) {
    super();

    this.graph = null;
    this.model = model;

    this.nodeMenu = new ContextMenu([
      new MenuItem('add'),
      new MenuItem('delete')
    ]);
    this.linkMenu = new ContextMenu([
      new MenuItem('set color')
    ]);
    this.colorPicker = new ColorPicker();

    addNodeMenuHandlers.call(this);
    addLinkMenuHandlers.call(this);
    addColorPickerHandlers.call(this);
  }

  toString() {
    return `[Mindmap]`;
  }

  //region get / set

  get model() {
    return model_.get(this);
  }

  set model(model) {
    model_.set(this, model);

    this.graph && this.graph.removeAllListeners();

    this.graph = toGraph(model);
    addGraphHandlers.call(this);
  }

  //endregion

  //region handlers

  onGraphClick() {
    this.nodeMenu.active && this.nodeMenu.deactivate();
    this.linkMenu.active && this.linkMenu.deactivate();
    this.colorPicker.active && this.colorPicker.deactivate();
  }

  onNodeChange(node) {
    let idea = toIdea(node);
    this.emit('ideaChange', idea);
  }

  onLinkChange(link) {
    let assoc = toAssoc(link);
    this.emit('assocChange', assoc);
  }

  onViewboxChange() {
    let mindmap = toMindmap(this.graph);
    this.emit('mindmapChange', mindmap);
  }

  onNodeRightClick(node, pos) {
    this.nodeMenu.activate({pos, target: node});
  }

  onLinkRightClick(link, pos) {
    if (!link.isBOI) {
      // color can be set on BOI links only
      return;
    }

    this.linkMenu.activate({pos, target: link});
  }

  onNodeMenuItem(menuItem) {
    let idea = toIdea(this.nodeMenu.target);

    switch (menuItem.displayValue) {
      case 'add': this.emit('ideaAdd', idea); break;
      case 'delete': this.emit('ideaDelete', idea); break;
      default: throw Error('unknown menu item');
    }

    this.nodeMenu.deactivate();
  }

  onLinkMenuItem(menuItem) {
    let link = this.linkMenu.target;

    switch (menuItem.displayValue) {
      case 'set color': this.colorPicker.activate(link); break;
      default: throw Error('unknown menu item');
    }

    this.linkMenu.deactivate();
  }

  onPickerColor(color) {
    let target = this.colorPicker.target;

    if (target.constructor === Link) {
      let idea = toIdea(target.toNode);
      idea.color = color;
      this.emit('ideaChange', idea);
    }

    this.colorPicker.deactivate();
  }

  //endregion

}

//region privates

function addGraphHandlers() {
  this.graph.on('click', this.onGraphClick.bind(this));

  this.graph.on('nodeChange', this.onNodeChange.bind(this));
  this.graph.on('linkChange', this.onLinkChange.bind(this));
  this.graph.on('viewportChange', this.onViewboxChange.bind(this));

  this.graph.on('nodeRightClick', this.onNodeRightClick.bind(this));
  this.graph.on('linkRightClick', this.onLinkRightClick.bind(this));
}

function addNodeMenuHandlers() {
  this.nodeMenu.on('itemSelected', this.onNodeMenuItem.bind(this));
}

function addLinkMenuHandlers() {
  this.linkMenu.on('itemSelected', this.onLinkMenuItem.bind(this));
}

function addColorPickerHandlers() {
  this.colorPicker.on('colorSelected', this.onPickerColor.bind(this));
}

//endregion