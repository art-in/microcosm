import Mongo from 'mongodb';

export function idToStr(id) {
    return typeof id === 'string' ? id : id.toHexString();
}

export function strToId(id) {
    //noinspection JSClosureCompilerSyntax
    return typeof id === 'string' ? new Mongo.ObjectID(id) : id;
}

export function newId() {
    return new Mongo.ObjectID();
}

export function newIdStr() {
    return newId().toHexString();
}
