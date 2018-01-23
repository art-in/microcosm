import regHandlersFolder from 'utils/reg-handlers-folder';

// TODO: group handlers by folders or name similar so same components are close
// eslint-disable-next-line no-undef
const context = require.context('./handlers', true, /\.js$/);

export default regHandlersFolder(context);
