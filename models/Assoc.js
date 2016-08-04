import {newIdStr, mapObject} from 'lib/helpers/helpers';

export default class Assoc {

    constructor(obj) {
        this.id = newIdStr();
        this.from = '';
        this.to = '';
        this.value = '';

        if (obj) {
            mapObject(this, obj);
        }
    }

    toString() {
        return `[Assoc ` +
            `(${this.id}) ` +
            `(${this.from} - ${this.to}) ` +
            `(${this.value})]`;
    }
};