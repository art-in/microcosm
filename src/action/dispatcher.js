import Dispatcher from 'utils/state/Dispatcher';

// collect all action handlers into one dispatcher
const disp = new Dispatcher();

// dinamicaly register all handlers in 'handlers' folder
// eslint-disable-next-line no-undef
const context = require.context('./handlers', true, /\.js$/);
context.keys().forEach(modulePath => {
    const module = context(modulePath);
    const actionType = modulePath.match(/.+\/(.+)\./i)[1];
    disp.reg(actionType, module.default);
});

export default disp;