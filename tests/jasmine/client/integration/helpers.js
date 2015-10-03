function importing(modulePaths, cb) {
  modulePaths = Array.isArray(modulePaths) ? modulePaths : [modulePaths];
  Promise.all(modulePaths.map(x => System.import(x)))
    .then(function(modules) {
      cb.apply(null, modules.map(m => m.default));
    });
}