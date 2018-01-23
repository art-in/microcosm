import regHandlersFolder from 'utils/reg-handlers-folder';

// eslint-disable-next-line no-undef
const context = require.context('./handlers', true, /\.js$/);

export default regHandlersFolder(context);
