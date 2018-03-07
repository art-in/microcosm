import express from 'express';
import HttpStatus from 'http-status-codes';

import ApiErrorCode from './utils/ApiErrorCode';
import asyncMiddleware from './utils/async-middleware';
import addDbServerUser from './utils/add-db-server-user';
import createDatabase from './utils/create-database';
import addDbUser from './utils/add-db-user';

// @ts-ignore relative path from build folder
import config from '../config';

const db = config.server.database;
const credentials = db.auth.on ? `${db.auth.name}:${db.auth.password}@` : '';
const dbServerUrl = `${db.protocol}://${credentials}${db.host}:${db.port}`;

const auth = express.Router();

/**
 * Signs up new user
 *
 * @example
 * curl --request POST \
 * --url https://example.com/auth \
 * --header 'content-type: application/json' \
 * --data '{"name": "new_user", "password": "123"}'
 */
auth.post(
  '/',
  asyncMiddleware(async (req, res) => {
    const {invite, name, password} = req.body;

    // check invite code
    if (
      config.client.signup.invite.on &&
      config.client.signup.invite.code !== invite
    ) {
      const err = {error: ApiErrorCode.invalidInviteCode};
      console.error(err);
      res.status(HttpStatus.UNAUTHORIZED).send(err);
      return;
    }

    // check username
    if (!name) {
      const err = {error: ApiErrorCode.emptyUserName};
      console.error(err);
      res.status(HttpStatus.FORBIDDEN).send(err);
      return;
    }

    // check password
    if (!password) {
      const err = {error: ApiErrorCode.weakPassword};
      console.error(err);
      res.status(HttpStatus.FORBIDDEN).send(err);
      return;
    }

    // add new user
    let dbResponse = await addDbServerUser(dbServerUrl, name, password);

    if (dbResponse.error) {
      if (dbResponse.error === 'conflict') {
        const err = {error: ApiErrorCode.duplicateUserName};
        console.error(err, dbResponse);
        res.status(HttpStatus.FORBIDDEN).send(err);
      } else {
        const err = {error: ApiErrorCode.internalError};
        console.error(err, dbResponse);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }
      return;
    }

    // create user databases
    let responses = await Promise.all([
      await createDatabase(dbServerUrl, name, 'mindsets'),
      await createDatabase(dbServerUrl, name, 'ideas'),
      await createDatabase(dbServerUrl, name, 'associations')
    ]);

    dbResponse = responses.find(r => r.error);
    if (dbResponse) {
      const err = {error: ApiErrorCode.internalError};
      console.error(err, dbResponse);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      return;
    }

    // authorize new user to databases
    responses = await Promise.all([
      await addDbUser(dbServerUrl, name, 'mindsets'),
      await addDbUser(dbServerUrl, name, 'ideas'),
      await addDbUser(dbServerUrl, name, 'associations')
    ]);

    dbResponse = responses.find(r => r.error);
    if (dbResponse) {
      const err = {error: ApiErrorCode.internalError};
      console.error(err, dbResponse);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      return;
    }

    res.status(HttpStatus.CREATED).send({ok: true});
  })
);

// auth error handler
// eslint-disable-next-line no-unused-vars
auth.use(function(err, req, res, next) {
  console.error('Auth:', err);
  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .send({error: ApiErrorCode.internalError});
});

export default auth;
