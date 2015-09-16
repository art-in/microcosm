export function strFromId(id) {
  return typeof id === 'string' ? id : id._str;
}

export function idFromStr(str) {
  //noinspection JSClosureCompilerSyntax
  return new Mongo.ObjectID(str);
}