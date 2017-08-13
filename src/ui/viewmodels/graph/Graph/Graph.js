import EventedViewModel from '../../shared/EventedViewModel';

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

        // graph clicked
        'click',

        // node was right clicked
        'node-rightclick',

        // link was right clicked
        'link-rightclick'
    ]
    
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
        scaleMax: 2
    };

    /**
     * Panning state
     */
    pan = {
        active: false
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
     * Sets viewport size
     * @param {object} opts
     * @param {number} opts.width
     * @param {number} opts.height
     */
    setViewportSize({width, height}) {
        this.viewport.width = width;
        this.viewport.height = height;

        this.recomputeViewbox();
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
        this.emit('node-rightclick', node, pos);
    }

    /**
     * Handles link right click event
     * @param {Link} link
     * @param {object} pos
     */
    onLinkRightClick(link, pos) {
        this.emit('link-rightclick', link, pos);
    }

    /**
     * Handles viewport resize event
     * @param {object} size
     */
    onViewportResize(size) {
        this.setViewportSize(size);
        
        this.emit('change');
    }

    /**
     * Handles wheel event
     * @param {boolean} up
     */
    onWheel(up) {
        this.zoom(up);
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
        this.viewbox.x -= shiftX;
        this.viewbox.y -= shiftY;

        this.emit('change');
    }

    /**
     * Handles pan stop event
     */
    onPanStop() {
        if (!this.pan.active) {
            return;
        }

        this.pan.active = false;
        this.emit('viewbox-position-change', {
            graphId: this.id,
            pos: {
                x: this.viewbox.x,
                y: this.viewbox.y
            }
        });
    }

    /**
     * Handles drag start event
     * @param {Node} node
     */
    onDragStart(node) {
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

    /**
     * Zooms graph in or out
     * @param {boolean} _in
     */
    zoom(_in) {
        const viewbox = this.viewbox;

        if ((_in && viewbox.scale >= viewbox.scaleMax) ||
            (!_in && viewbox.scale <= viewbox.scaleMin)) {
            // do not scale out of boundaries
            return;
        }

        // zoom by 20%
        viewbox.scale += (_in ? 1 : -1) * 0.2 * viewbox.scale;

        const {width: prevWidth, height: prevHeight} = viewbox;
        this.recomputeViewbox();

        // zoom to/from the center of viewbox
        viewbox.x += (prevWidth - viewbox.width) / 2;
        viewbox.y += (prevHeight - viewbox.height) / 2;

        this.emit('viewbox-scale-change', {
            graphId: this.id,
            scale: this.viewbox.scale
        });
    }

    /**
     * Recomputes geometry of viewbox
     */
    recomputeViewbox() {
        const viewbox = this.viewbox;

        const {min, max, round} = Math;

        viewbox.scale = max(viewbox.scaleMin, viewbox.scale);
        viewbox.scale = min(viewbox.scaleMax, viewbox.scale);
        viewbox.scale = round(viewbox.scale * 100) / 100;

        viewbox.width = round(this.viewport.width / viewbox.scale);
        viewbox.height = round(this.viewport.height / viewbox.scale);
    }
}