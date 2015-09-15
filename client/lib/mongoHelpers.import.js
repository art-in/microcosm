export function getIdStr(document) {
  if (!document._id) { throw Error('invalid Mongo document'); }

  return typeof document._id === 'string' ? document._id
                                          : document._id._str;
}

export function getIdFromStr(str) {

  return new Mongo.ObjectID(str);
}