import Handler from 'utils/state/Handler';

/**
 * Dynamicly registers action handlers in folder
 *
 * Action type    - module name
 * Action handler - module default export
 *
 * @example
 * const context = require.context('./handlers', true, /\.js$/)
 * const handler = regHandlersFolder(context);
 *
 * @param {object} context - webpack context
 * @return {Handler}
 */
export default function regHandlersFolder(context) {
  // collect all action handlers
  const handler = new Handler();

  context.keys().forEach(modulePath => {
    const module = context(modulePath);
    const actionType = modulePath.match(/.+\/(.+)\./i)[1];
    handler.reg(actionType, module.default);
  });

  return handler;
}
