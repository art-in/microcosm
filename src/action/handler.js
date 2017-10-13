import Handler from 'utils/state/Handler';

// collect all action handlers into one
const handler = new Handler();

// dinamicaly register all handlers in 'handlers' folder
// eslint-disable-next-line no-undef
const context = require.context('./handlers', true, /\.js$/);
context.keys().forEach(modulePath => {
    const module = context(modulePath);
    const actionType = modulePath.match(/.+\/(.+)\./i)[1];
    handler.reg(actionType, module.default);
});

export default handler;