import EventedViewModel from 'vm/utils/EventedViewModel';

import ColorPicker from 'vm/shared/ColorPicker';
import ContextMenu from 'vm/shared/ContextMenu';
import MenuItem from 'vm/shared/MenuItem';
import Link from 'vm/map/entities/Link';

/**
 * Mindmap view model
 * 
 * Represents root mindmap component, which can show
 * mindmap in different forms (map, list, etc)
 */
export default class Mindmap extends EventedViewModel {

    static eventTypes = [

        'change',

        'idea-color-change',

        'idea-add',

        'idea-remove'
    ]

    /**
     * Graph model
     * @type {Graph}
     */
    _graph;

    /**
     * Gets graph VM
     * @return {Graph}
     */
    get graph() {
        return this._graph;
    }

    /**
     * Sets graph VM
     * @param {Graph} graph
     */
    set graph(graph) {
        this._graph && this._graph.removeAllListeners();
        this._graph = graph;
        this.addGraphHandlers();
    }
    
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
     */
    constructor() {
        super();

        this.addNodeMenuHandlers();
        this.addLinkMenuHandlers();
        this.addColorPickerHandlers();
    }

    /**
     * Stringifies instance
     * @return {string}
     */
    toString() {
        return `[Mindmap VM]`;
    }

    /**
     * Binds graph vm events
     */
    addGraphHandlers() {
        this.graph.on('click', this.onGraphClick.bind(this));

        this.graph.on('node-rightclick', this.onNodeRightClick.bind(this));
        this.graph.on('link-rightclick', this.onLinkRightClick.bind(this));
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
        if (!link.isRooted) {
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
        
        const node = this.nodeMenu.target;

        switch (menuItem.displayValue) {
        case 'add':
            this.emit('idea-add', {parentIdeaId: node.id});
            break;
        case 'delete':
            this.emit('idea-remove', {ideaId: node.id});
            break;
        default:
            throw Error(`Unknown menu item '${menuItem.displayValue}'`);
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
        case 'set color':
            this.colorPicker.activate(link);
            break;
        default:
            throw Error(`Unknown menu item '${menuItem.displayValue}'`);
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
            this.emit('idea-color-change', {
                ideaId: target.to.id,
                color
            });
        }

        this.colorPicker.deactivate();
    }

}