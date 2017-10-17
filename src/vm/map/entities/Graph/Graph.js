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

        // graph clicked
        'click',

        // node was right clicked
        'node-rightclick',

        // link was right clicked
        'link-rightclick',

        'association-tails-lookup-phrase-changed',

        'association-tails-lookup-suggestion-selected',

        'context-menu-item-selected',

        'wheel',

        'viewport-resize'
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
        item: null,
        startX: null,
        startY: null
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
        node.on('title-change', title => this.emit('node-title-change', {
            nodeId: node.id,
            title
        }));
    }

    /**
     * Binds link events
     * @param {Link} link
     */
    addLinkHandlers(link) {
        link.on('title-change', title => this.emit('link-title-change', {
            linkId: link.id,
            title
        }));
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
        let panKeyStep = 20;
        let viewboxChanged = false;

        panKeyStep /= this.viewbox.scale;

        switch (keyCode) {
        case 'ArrowDown':
            this.onPan({shiftY: -panKeyStep});
            viewboxChanged = true;
            break;
        case 'ArrowUp':
            this.onPan({shiftY: panKeyStep});
            viewboxChanged = true;
            break;
        case 'ArrowLeft':
            this.onPan({shiftX: panKeyStep});
            viewboxChanged = true;
            break;
        case 'ArrowRight':
            this.onPan({shiftX: -panKeyStep});
            viewboxChanged = true;
            break;
        default:
            // skip
        }

        if (viewboxChanged) {
            this.emit('viewbox-position-change', {
                graphId: this.id,
                pos: {
                    x: this.viewbox.x,
                    y: this.viewbox.y
                }
            });
        }
    }

    /**
     * Handles pan start event
     */
    onPanStart() {
        this.pan.active = true;
    }

    /**
     * Handles pan event
     * @param {object} opts
     */
    onPan({shiftX = 0, shiftY = 0}) {
        this.pan.shifted = true;

        this.viewbox.x -= shiftX;
        this.viewbox.y -= shiftY;

        this.emit('change');
    }

    /**
     * Handles pan stop event
     */
    onPanStop() {
        if (this.pan.active && this.pan.shifted) {
            this.emit('viewbox-position-change', {
                graphId: this.id,
                pos: {
                    x: this.viewbox.x,
                    y: this.viewbox.y
                }
            });
        }

        this.pan.active = false;
        this.pan.shifted = false;
    }

    /**
     * Handles drag start event
     * @param {Node} node
     */
    onDragStart(node) {
        if (node.shaded) {
            // prevent actions on shaded nodes
            return;
        }

        this.drag = {
            active: true,
            node: node,
            startX: node.pos.x,
            startY: node.pos.y
        };
    }

    /**
     * Handles drag event
     * @param {object} opts
     */
    onDrag({shiftX, shiftY}) {
        if (!this.drag.active) {
            return;
        }

        this.moveNode({
            nodeId: this.drag.node.id,
            shift: {x: shiftX, y: shiftY}
        });
    }

    /**
     * Handles drag stop event
     */
    onDragStop() {
        if (!this.drag.active) {
            return;
        }

        this.drag.active = false;
        this.emit('node-position-change', {
            nodeId: this.drag.node.id,
            pos: this.drag.node.pos
        });
    }

    /**
     * Handles drag revert event (cancel dragging)
     */
    onDragRevert() {
        if (!this.drag.active) {
            return;
        }

        this.drag.active = false;

        this.moveNode({
            nodeId: this.drag.node.id,
            pos: {x: this.drag.startX, y: this.drag.startY}
        });
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

    /**
     * Gets node
     * @param {string} nodeId
     * @return {Node}
     */
    getNode(nodeId) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (!node) {
            throw Error(`No node with such id found: ${nodeId}`);
        }
        return node;
    }

    /**
     * Moves node position
     * @param {object} opts
     */
    moveNode({nodeId, pos, shift}) {
        const node = this.getNode(nodeId);

        if (shift) {
            node.pos.x += shift.x;
            node.pos.y += shift.y;
        } else {
            node.pos.x = pos.x;
            node.pos.y = pos.y;
        }

        this.emit('change');
    }

}