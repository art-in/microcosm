import {newIdStr, mapObject} from 'lib/helpers/helpers';

export default class Mindmap {

    constructor(obj) {
        this.id = newIdStr();
        this.mindmapId = undefined;
        this.x = 0;
        this.y = 0;
        this.scale = 0;

        this.ideas = [];
        this.assocs = [];

        if (obj) {
            mapObject(this, obj);
        }
    }

    toString() {
        return `[Mindmap ` +
            `(${this.x} - ${this.y}) (${this.scale})` +
            `]`;
    }

}
