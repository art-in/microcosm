import {newIdStr, mapObject} from 'lib/helpers/helpers';

export default class Idea {

    constructor(obj) {
        this.id = newIdStr();
        this.mindmapId = undefined;
        this.x = undefined;
        this.y = undefined;
        this.value = '';
        this.isCentral = false;
        this.color = '';

        if (obj) {
            mapObject(this, obj);
        }
    }

    toString() {
        return `[Idea` +
            (this.isCentral ? `* ` : ` `) +
            `(mm: ${this.mindmapId}) ` +
            `(${this.id}) ` +
            `(${this.x} x ${this.y}) ` +
            `(${this.value})]`;
    }

}