import {nodeToIdea as toIdea} from 'client/mappers/nodeMapper';
import {linkToAssoc as toAssoc} from 'client/mappers/linkMapper';
import {graphToMindmap as toMindmap} from 'client/mappers/graphMapper';
import {mindmapToGraph as toGraph} from 'client/mappers/graphMapper';

import EventedViewModel from './shared/EventedViewModel';
import ColorPicker from './misc/ColorPicker';
import ContextMenu from './misc/ContextMenu';
import MenuItem from './misc/MenuItem';
import Link from './graph/Link';

/**
 * Mindmap view model
 */
export default class Mindmap extends EventedViewModel {

    static eventTypes = [

        // state changed
        'change',

        // new idea was added
        'ideaAdd',

        // idea was changed
        'ideaChange',

        // idea was deleted
        'ideaDelete',

        // association changed
        'assocChange',

        // mindmap changed
        'mindmapChange'
    ]

    /**
     * Graph model
     * @type {Graph}
     */
    graph;
    
    /**
     * Mindmap model
     * @type {Mindmap}
     */
    model;

    /**
     * Context menu of nodes
     */
    nodeMenu = new ContextMenu([
        new MenuItem('add'),
        new MenuItem('delete')
    ]);

    /**
     * Context menu of links
     */
    linkMenu = new ContextMenu([
        new MenuItem('set color')
    ]);

    /**
     * Color picker
     */
    colorPicker = new ColorPicker()

    /**
     * constructor
     * @param {Mindmap} model
     */
    constructor(model) {
        super();

        this.model = model;

        this.addNodeMenuHandlers();
        this.addLinkMenuHandlers();
        this.addColorPickerHandlers();
    }

    /**
     * Stringifies instance
     * @return {string}
     */
    toString() {
        return `[Mindmap]`;
    }

    _model;

    /**
     * Model setter
     */
    get model() {
        return this._model;
    }

    /**
     * Model getter
     * @param {Mindmap} model
     */
    set model(model) {
        this._model = model;

        this.graph && this.graph.removeAllListeners();

        this.graph = toGraph(model);
        this.addGraphHandlers();
    }

    /**
     * Binds graph vm events
     */
    addGraphHandlers() {
        this.graph.on('click', this.onGraphClick.bind(this));

        this.graph.on('nodeChange', this.onNodeChange.bind(this));
        this.graph.on('linkChange', this.onLinkChange.bind(this));
        this.graph.on('viewboxChange', this.onGraphViewboxChange.bind(this));

        this.graph.on('nodeRightClick', this.onNodeRightClick.bind(this));
        this.graph.on('linkRightClick', this.onLinkRightClick.bind(this));
    }

    /**
     * Binds node menu events
     */
    addNodeMenuHandlers() {
        this.nodeMenu.on('itemSelected',
            this.onNodeMenuItemSelected.bind(this));
    }

    /**
     * Binds link menu events
     */
    addLinkMenuHandlers() {
        this.linkMenu.on('itemSelected',
            this.onLinkMenuItemSelected.bind(this));
    }

    /**
     * Binds color picker events
     */
    addColorPickerHandlers() {
        this.colorPicker.on('colorSelected',
            this.onPickerColorSelected.bind(this));
    }

    /**
     * Handles graph click
     */
    onGraphClick() {
        this.nodeMenu.active && this.nodeMenu.deactivate();
        this.linkMenu.active && this.linkMenu.deactivate();
        this.colorPicker.active && this.colorPicker.deactivate();
    }

    /**
     * Handles node change event
     * @param {Node} node
     */
    onNodeChange(node) {
        const idea = toIdea(node, this.model.ideas.find(i => i.id === node.id));
        this.emit('ideaChange', idea);
    }

    /**
     * Handles link change event
     * @param {Link} link
     */
    onLinkChange(link) {
        const assoc = toAssoc(link, this.model.assocs
            .find(a => a.id === link.id));
        this.emit('assocChange', assoc);
    }

    /**
     * Handles graph viewbox change event
     */
    onGraphViewboxChange() {
        const mindmap = toMindmap(this.graph, this.model);
        this.emit('mindmapChange', mindmap);
    }

    /**
     * Handles node right click event
     * @param {Node} node
     * @param {object} pos
     */
    onNodeRightClick(node, pos) {
        this.nodeMenu.activate({pos, target: node});
    }

    /**
     * Handles link right click event
     * @param {Link} link
     * @param {object} pos
     */
    onLinkRightClick(link, pos) {
        if (!link.isBOI) {
            // color can be set on BOI links only
            return;
        }

        this.linkMenu.activate({pos, target: link});
    }

    /**
     * Handles node menu item selected event
     * @param {MenuItem} menuItem
     */
    onNodeMenuItemSelected(menuItem) {
        const idea = this.model.ideas
            .find(i => i.id === this.nodeMenu.target.id);

        switch (menuItem.displayValue) {
            case 'add': this.emit('ideaAdd', idea); break;
            case 'delete': this.emit('ideaDelete', idea); break;
            default: throw Error('unknown menu item');
        }

        this.nodeMenu.deactivate();
    }

    /**
     * Handles link menu item selected event
     * @param {MenuItem} menuItem
     */
    onLinkMenuItemSelected(menuItem) {
        const link = this.linkMenu.target;

        switch (menuItem.displayValue) {
            case 'set color': this.colorPicker.activate(link); break;
            default: throw Error('unknown menu item');
        }

        this.linkMenu.deactivate();
    }

    /**
     * Handles color selected event
     * @param {string} color
     */
    onPickerColorSelected(color) {
        const target = this.colorPicker.target;

        if (target instanceof Link) {
            const idea = this.model.ideas.find(i => i.id === target.toNode.id);
            idea.color = color;
            this.emit('ideaChange', idea);
        }

        this.colorPicker.deactivate();
    }

}