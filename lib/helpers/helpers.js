/**
 * Sequentially load modules
 *
 * @example importingSeq(['modules/A', 'modules/B']);
 */
importingSeq = function(modules) {
  modules.reduce((prev, cur) =>
      prev.then(System.import.bind(System, cur)), Promise.resolve())
      .done(); // throw unhandled rejections
};

/**
 * System.import helper
 * Should be used in tests only, since '.import.js' tests cannot be
 * transpiled by 'universe:modules' currently.
 *
 * This is temporary solution until Velocity tests transpiling is supported
 * https://github.com/meteor-velocity/velocity/issues/356
 *
 * @example
 * importing([
 *    'modules/Ref1',
 *    'modules/Ref2'],
 *    function(Ref1, Ref2) {
 *
 *      // Use Ref defaults
 *
 *    })
 */
importing = function(modulePaths, cb) {
  modulePaths = Array.isArray(modulePaths) ? modulePaths : [modulePaths];
  Promise.all(modulePaths.map(x => System.import(x)))
      .then(function(modules) {
        cb.apply(null, modules.map(m => m.default));
      })
      .done(); // throw unhandled rejections
};