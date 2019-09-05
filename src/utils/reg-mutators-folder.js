/**
 * Dynamically registers mutators in folder
 *
 * Mutation type - module name
 * Mutator       - module default export
 *
 * @example
 * const context = require.context('./mutators', true, /\.js$/)
 * const mutators = regMutatorsFolder(context);
 *
 * @param {object} context - webpack context
 * @return {object}
 */
export default function regMutatorsFolder(context) {
  const mutators = {};

  context.keys().forEach(modulePath => {
    const module = context(modulePath);
    const type = modulePath.match(/.+\/(.+)\./i)[1];

    if (mutators[type]) {
      throw Error(`Mutation '${type}' already has registered handler`);
    }
    if (type !== 'index') {
      mutators[type] = module.default;
    }
  });

  return mutators;
}
