export function idToStr(id) {
  return typeof id === 'string' ? id : id.valueOf();
}

export function strToId(id) {
  //noinspection JSClosureCompilerSyntax
  return typeof id === 'string' ? new Mongo.ObjectID(id) : id;
}

export function newId() {
  return new Mongo.ObjectID();
}

export function newIdStr() {
  return newId().valueOf();
}

export default {
  idToStr,
  strToId,
  newId,
  newIdStr
}