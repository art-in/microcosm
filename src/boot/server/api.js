import express from 'express';
import HttpStatus from 'http-status-codes';

// @ts-ignore relative path from build folder
import config from '../config';
// @ts-ignore relative path from build folder
import pkg from '../package.json';

const api = express.Router();

api.get('/config', (req, res) => {
  const clientConfig = {
    app: {
      name: pkg.name,
      homepage: pkg.homepage,
      version: pkg.version
    },
    dbServer: config.server.database.url,
    signupInviteRequired: config.client.signup.invite.on
  };

  res.status(HttpStatus.OK).send(clientConfig);
});

export default api;
