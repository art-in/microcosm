import Mongo from 'mongodb';

/**
 * Converts db object ID to string
 * @param {ObjectID|string} id
 * @return {string}
 */
export function idToStr(id) {
    return typeof id === 'string' ? id : id.toHexString();
}

/**
 * Converts string to db object ID
 * @param {ObjectID|string} id
 * @return {ObjectID}
 */
export function strToId(id) {
    return typeof id === 'string' ? new Mongo.ObjectID(id) : id;
}

/**
 * Creates new db ID
 * @return {ObjectID}
 */
export function newId() {
    return new Mongo.ObjectID();
}

/**
 * Creates new db ID
 * @return {string}
 */
export function newIdStr() {
    return newId().toHexString();
}