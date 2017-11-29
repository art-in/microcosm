/**
 * Priority queue.
 * https://en.wikipedia.org/wiki/Priority_queue
 */
export default class PriorityQueue {
    
    /** @type {Array.<{item, priority}>} */
    _entries = [];

    /** @type {Set} */
    _items = new Set();

    /**
     * Gets length of the queue
     * @return {number}
     */
    get length() {
        return this._entries.length;
    }

    /**
     * Adds new item with corresponding priority.
     * @param {Object.<string, *>} item - item to enqueue. objects allowed only.
     *        primitives will not work since each item should be unique
     *        to be able to update their priority properly
     * @param {number} priority
     */
    addWithPriority(item, priority) {

        // get entry position (time - O(log n))
        const idx = binarySearchIndex(this._entries, priority);

        // add entry
        const entry = {item, priority};
        this._entries.splice(idx, 0, entry);

        this._items.add(item);
    }

    /**
     * Updates item priority.
     * @param {object} item
     * @param {number} priority
    */
    updatePriority(item, priority) {

        // find entry by item value (time - O(n))
        const idx = this._entries.findIndex(e => e.item === item);
        if (idx === -1) {
            throw Error(`Unknown item '${item}' to update priority for`);
        }

        const entry = this._entries[idx];

        if (entry.priority === priority) {
            // priority is not changed
            return;
        }

        // remove entry from prev position
        this._entries.splice(idx, 1);

        // update priority
        entry.priority = priority;

        // add entry to new position
        const newIdx = binarySearchIndex(this._entries, priority);
        this._entries.splice(newIdx, 0, entry);
    }

    /**
     * Extracts item with min priority.
     * @return {*} item
     */
    extractMin() {
        if (this._entries.length === 0) {
            throw Error('Failed to extract from empty queue');
        }

        // extract item (time - O(1))
        const entry = this._entries.shift();
        this._items.delete(entry.item);

        return entry.item;
    }

    /**
     * Checks whether item exists in the queue.
     * @param {object} item
     * @return {boolean}
     */
    has(item) {
        // check existance (time - O(1))
        return this._items.has(item);
    }
}

/**
 * Find position for new item in array to keep it sorted
 * 
 * @param {array} entries
 * @param {number} priority - priority of new item
 * @return {number} array index
 */
function binarySearchIndex(entries, priority) {

    let low = 0;
    let high = entries.length;
    while (low < high) {
        const mid = (low + high) >>> 1;
        if (entries[mid].priority < priority) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }

    return low;
}