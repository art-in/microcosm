import express from 'express';
import fetch, {Response as FetchResponseType} from 'node-fetch';

import asyncMiddleware from './utils/async-middleware';

// @ts-ignore relative path from build folder
import config from '../config.serve';

const db = config.server.database;

const credentials = db.auth.on ? `${db.auth.name}:${db.auth.password}@` : '';
const dbServerUrl = `${db.protocol}://${credentials}${db.host}:${db.port}`;

const auth = express.Router();

/**
 * Registers new user
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
    const {name, password} = req.body;

    // add new user
    let dbResponse = await addDbServerUser(dbServerUrl, name, password);

    if (dbResponse.error) {
      const err = {reason: 'Auth: Failed to add new user.', dbResponse};
      console.error(err);
      res.status(500).send(err);
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
      const err = {reason: 'Auth: Failed to create user database.', dbResponse};
      console.error(err);
      res.status(500).send(err);
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
      const err = {reason: 'Auth: Failed to authorize user.', dbResponse};
      console.error(err);
      res.status(500).send(err);
      return;
    }

    res.status(201).send();
  })
);

/**
 * Adds user to database server
 *
 * @param {string} dbServerUrl
 * @param {string} userName - user name
 * @param {string} password - user password
 * @return {Promise.<Object.<string, *>>}
 */
async function addDbServerUser(dbServerUrl, userName, password) {
  const response = await fetch(
    `${dbServerUrl}/_users/org.couchdb.user:${userName}`,
    {
      method: 'PUT',
      headers: {
        ['Accept']: 'application/json',
        ['Content-Type']: 'application/json'
      },
      body: JSON.stringify({name: userName, password, roles: [], type: 'user'})
    }
  );

  return await response.json();
}

/**
 * Creates database
 *
 * @param {string} dbServerUrl
 * @param {string} userName
 * @param {string} dbName
 * @return {Promise.<Object.<string, *>>}
 */
async function createDatabase(dbServerUrl, userName, dbName) {
  const url = `${dbServerUrl}/${userName}_${dbName}`;
  const response = await fetch(url, {method: 'PUT'});
  return await response.json();
}

/**
 * Adds user to database
 *
 * @param {string} dbServerUrl
 * @param {string} userName
 * @param {string} dbName
 * @return {Promise.<Object.<string, *>>}
 */
async function addDbUser(dbServerUrl, userName, dbName) {
  const url = `${dbServerUrl}/${userName}_${dbName}/_security`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      ['Content-Type']: 'application/json'
    },
    body: JSON.stringify({members: {names: [userName]}})
  });
  return await response.json();
}

export default auth;
