const path = require('path');
const fs = require('fs');
const spawn = require('child_process').spawn;

const table = require('text-table');

const config = require('../../config');

const {stdout, stderr} = process;

module.exports = () => {
  if (config.server.static.secure.enabled) {
    // https is not supported by pouchdb-server, but it should be easy to use
    // express-pouchdb directly and start it over https. ignoring for now.
    throw Error(
      `Trying to use development database server (http) while static is ` +
        `served through secure connection (https). This will result in mixed ` +
        `content and db connection will be blocked by client browser. ` +
        `Either serve static over http or run separate db server over https.`
    );
  }

  const {protocol, host, port} = config.server.database.url;

  if (config.server.database.url.protocol !== 'http') {
    throw Error(
      `Invalid protocol for development database server '${protocol}'. ` +
        `Only 'http' is supported currently.`
    );
  }

  // ensure dir path exists, so we can cwd there
  const dbDirPath = path.resolve(config.server.database.dev.dir);
  mkdirSafeSync(dbDirPath);

  const ps = spawn(
    'node',
    [
      require.resolve('pouchdb-server'),
      '--host',
      host,
      '--port',
      port.toString(),
      '--dir',
      dbDirPath,
      // TODO: use '--no-stdout-logs' when it will be fixed
      // https://github.com/pouchdb/pouchdb-server/issues/115
      '-n'
    ],
    {
      // change working directory to db dir so log file will be created there
      // and not in current dir by default ('pouchdb-server' does not provide
      // special CLI arg, but config file option only)
      cwd: dbDirPath
    }
  );

  const prefix = '[pouchdb-server] ';

  ps.stdout.on('data', data => stdout.write(prefix + data.toString()));
  ps.stderr.on('data', data => stderr.write(prefix + data.toString()));
  ps.on('exit', code => stdout.write(`${prefix} exit (${code.toString()})`));

  console.log(
    `PouchDB server started\n` +
      table([
        ['\t db folder', dbDirPath],
        ['\t listening at', `${protocol}://${host}:${port}`]
      ])
  );
};

/**
 * Creates directory if it does not exist
 * @param {string} dirPath
 */
function mkdirSafeSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
}
