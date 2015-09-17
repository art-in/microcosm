export function methodsInScope(scope, methods) {
  let methodsMap = {};

  for (var method in methods) {
    //noinspection JSUnfilteredForInLoop
    methodsMap[`${scope}.${method}`] = methods[method];
  }

  Meteor.methods(methodsMap);
}