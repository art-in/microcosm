import EventedViewModel from 'vm/utils/EventedViewModel';

import ColorPicker from 'vm/shared/ColorPicker';
import ContextMenu from 'vm/shared/ContextMenu';
import LookupPopup from 'vm/shared/LookupPopup';

/**
 * Graph view model.
 *
 * Canvas - infinite 2D logical space containing all objects of the scene
 * Viewbox - logical rectangle fragment of canvas mapped to viewport
 *           its size and position regulated with zooming and panning
 *           aspect ratio of viewbox equals to aspect ratio of viewport
 * Viewport - physical rectangle surface of rendering engine
 */
export default class Graph extends EventedViewModel {

    static eventTypes = [
        
        'change',

        'node-title-change',

        'link-title-change',

        'node-position-change',

        'viewbox-position-change',

        'viewbox-scale-change',

        'picker-color-change',
        
        'node-menu-idea-add',

        'node-menu-idea-remove',

        'click',

        'node-rightclick',

        'link-rightclick',

        'association-tails-lookup-phrase-changed',

        'association-tails-lookup-suggestion-selected',

        'context-menu-item-selected',

        'wheel',

        'viewport-resize',

        'node-mouse-down',

        'mouse-up',

        'mouse-move',

        'mouse-leave',

        'mouse-down',

        'key-press',

        'node-title-double-click',

        'node-title-blur'
    ]
    
    /**
     * 
     */
    constructor() {
        super();

        this.contextMenu.on('itemSelected', menuItem =>
            this.emit('context-menu-item-selected', {menuItem}));

        this.colorPicker.on('colorSelected',
            this.onPickerColorSelected.bind(this));

        this.associationTailsLookup.on('phrase-changed',
            this.onAssociationTailsLookupPhraseChanged.bind(this));

        this.associationTailsLookup.on('suggestion-selected',
            this.onAssociationTailsLookupSuggestionSelected.bind(this));
    }

    id = undefined;

    /**
     * Drawing surface
     */
    viewport = {
        width: 0,
        height: 0
    };
    
    /**
     * Fragment of canvas
     */
    viewbox = {

        // position on canvas
        x: 0,
        y: 0,

        // size
        width: 0,
        height: 0,

        // scale (affects the size)
        scale: 1,
        scaleMin: 0.2,
        scaleMax: Infinity
    };

    zoomInProgress = false;

    /**
     * Panning state
     */
    pan = {
        active: false,
        shifted: false
    };

    /**
     * Dragging state
     */
    drag = {
        active: false,
        node: undefined,
        startX: undefined,
        startY: undefined
    };

    /**
     * Debug state
     */
    debug = true;

    /**
     * Stringifies instance
     * @return {string}
     */
    toString() {
        return `[Graph (${this.nodes}) (${this.links})]`;
    }

    _nodes = [];
    _link = [];

    /**
     * Nodes getter
     */
    get nodes() {
        return this._nodes;
    }

    /**
     * Nodes setter
     * @param {array} nodes
     */
    set nodes(nodes) {
        nodes.forEach(this.addNodeHandlers.bind(this));
        nodes.forEach(n => n.debug = this.debug);
        this._nodes = nodes;
    }

    /**
     * Links getter
     */
    get links() {
        return this._links;
    }

    /**
     * Links setter
     * @param {array} links`
     */
    set links(links) {
        links.forEach(this.addLinkHandlers.bind(this));
        links.forEach(l => l.debug = this.debug);
        this._links = links;
    }

    /**
     * Depth of nodes which resulting size 
     * is close to original for current viewbox scale
     * @type {number}
     */
    focusDepth = undefined;

    /**
     * Lenght of longest path from root to leaf node
     * @type {number}
     */
    height = undefined;

    /**
     * Context menu of links
     */
    contextMenu = new ContextMenu();

    /**
     * Color picker
     */
    colorPicker = new ColorPicker()

    /**
     * Lookup for selecting tail idea for cross-association
     * @type {LookupPopup}
     */
    associationTailsLookup = new LookupPopup('target idea...')

    /**
     * Binds node events
     * @param {Node} node
     */
    addNodeHandlers(node) {
        node.on('title-change',
            title => this.emit('node-title-change', {
                nodeId: node.id,
                title
            }));

        node.on('title-double-click',
            () => this.emit('node-title-double-click', {
                nodeId: node.id
            }));

        node.on('title-blur',
            () => this.emit('node-title-blur', {
                nodeId: node.id
            }));
    }

    /**
     * Binds link events
     * @param {Link} link
     */
    addLinkHandlers(link) {
    }

    /**
     * Handles click event
     */
    onClick() {
        this.emit('click');
    }

    /**
     * Handles node right click event
     * @param {Node} node
     * @param {object} pos
     */
    onNodeRightClick(node, pos) {
        this.emit('node-rightclick', {pos, node});
    }

    /**
     * Handles link right click event
     * @param {Link} link
     * @param {object} pos
     */
    onLinkRightClick(link, pos) {
        this.emit('link-rightclick', {pos, link});
    }

    /**
     * Handles viewport resize event
     * @param {object} size
     */
    onViewportResize(size) {
        this.emit('viewport-resize', {size});
    }

    /**
     * Handles mouse wheel event
     * @param {boolean} up
     * @param {Point} pos - target viewport position of mouse event
     */
    onWheel({up, pos}) {
        this.emit('wheel', {up, pos});
    }

    /**
     * Handles key press event
     * @param {string} keyCode
     */
    onKeyPress(keyCode) {
        this.emit('key-press', {keyCode});
    }

    /**
     * Handles pan start event
     */
    onMouseDown({button}) {
        this.emit('mouse-down', {button});
    }

    /**
     * @param {string} data
     */
    onNodeMouseDown(data) {
        this.emit('node-mouse-down', data);
    }

    /** */
    onMouseUp() {
        this.emit('mouse-up');
    }

    /**
     * @param {object} data
     */
    onMouseMove({viewportShift}) {
        this.emit('mouse-move', {viewportShift});
    }

    /**
     */
    onMouseLeave() {
        this.emit('mouse-leave');
    }

    /**
     * Handles color selected event
     * @param {string} color
     */
    onPickerColorSelected(color) {
        this.emit('picker-color-change', {
            picker: this.colorPicker,
            color
        });
    }

    /**
     * Handles phrase changed event from association tails lookup
     * @param {*} data 
     */
    onAssociationTailsLookupPhraseChanged({phrase}) {
        this.emit('association-tails-lookup-phrase-changed', {
            lookup: this.associationTailsLookup,
            phrase
        });
    }

    /**
     * Handles suggestion selected event from association tails lookup
     * @param {object} data
     * @param {LookupSuggestion} data.suggestion
     */
    onAssociationTailsLookupSuggestionSelected({suggestion}) {
        this.emit('association-tails-lookup-suggestion-selected', {
            lookup: this.associationTailsLookup,
            suggestion
        });
    }

}