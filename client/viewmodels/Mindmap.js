import EventedViewModel from './shared/EventedViewModel';
import ColorPicker from './misc/ColorPicker';
import ContextMenu from './misc/ContextMenu';
import MenuItem from './misc/MenuItem';
import {mindmapToGraph as toGraph} from 'client/mappers/graphMapper';
import Link from './graph/Link';
import {nodeToIdea as toIdea} from 'client/mappers/nodeMapper';
import {linkToAssoc as toAssoc} from 'client/mappers/linkMapper';
import {graphToMindmap as toMindmap} from 'client/mappers/graphMapper';

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

}

//region privates

function addGraphHandlers() {
    this.graph.on('click', onGraphClick.bind(this));

    this.graph.on('nodeChange', onNodeChange.bind(this));
    this.graph.on('linkChange', onLinkChange.bind(this));
    this.graph.on('viewboxChange', onViewboxChange.bind(this));

    this.graph.on('nodeRightClick', onNodeRightClick.bind(this));
    this.graph.on('linkRightClick', onLinkRightClick.bind(this));
}

function addNodeMenuHandlers() {
    this.nodeMenu.on('itemSelected', onNodeMenuItem.bind(this));
}

function addLinkMenuHandlers() {
    this.linkMenu.on('itemSelected', onLinkMenuItem.bind(this));
}

function addColorPickerHandlers() {
    this.colorPicker.on('colorSelected', onPickerColor.bind(this));
}

//endregion

//region handlers

function onGraphClick() {
    this.nodeMenu.active && this.nodeMenu.deactivate();
    this.linkMenu.active && this.linkMenu.deactivate();
    this.colorPicker.active && this.colorPicker.deactivate();
}

function onNodeChange(node) {
    let idea = toIdea(node, this.model.ideas.find(i => i.id === node.id));
    this.emit('ideaChange', idea);
}

function onLinkChange(link) {
    let assoc = toAssoc(link, this.model.assocs.find(a => a.id === link.id));
    this.emit('assocChange', assoc);
}

function onViewboxChange() {
    let mindmap = toMindmap(this.graph, this.model);
    this.emit('mindmapChange', mindmap);
}

function onNodeRightClick(node, pos) {
    this.nodeMenu.activate({ pos, target: node });
}

function onLinkRightClick(link, pos) {
    if (!link.isBOI) {
        // color can be set on BOI links only
        return;
    }

    this.linkMenu.activate({ pos, target: link });
}

function onNodeMenuItem(menuItem) {
    let idea = this.model.ideas.find(i => i.id === this.nodeMenu.target.id);

    switch (menuItem.displayValue) {
        case 'add': this.emit('ideaAdd', idea); break;
        case 'delete': this.emit('ideaDelete', idea); break;
        default: throw Error('unknown menu item');
    }

    this.nodeMenu.deactivate();
}

function onLinkMenuItem(menuItem) {
    let link = this.linkMenu.target;

    switch (menuItem.displayValue) {
        case 'set color': this.colorPicker.activate(link); break;
        default: throw Error('unknown menu item');
    }

    this.linkMenu.deactivate();
}

function onPickerColor(color) {
    let target = this.colorPicker.target;

    if (target.constructor === Link) {
        let idea = this.model.ideas.find(i => i.id === target.toNode.id);
        idea.color = color;
        this.emit('ideaChange', idea);
    }

    this.colorPicker.deactivate();
}

//endregion