const path = require("path");
const fs = require("fs");
const spawn = require("child_process").spawn;

const config = require("../../config.serve");

const { stdout, stderr } = process;

module.exports = () => {
  const { host, port } = config.server.database;
  const dbDirPath = path.resolve(config.server.database.dev.dir);

  // ensure dir path exists, so we can cwd there
  mkdirSafeSync(dbDirPath);

  const ps = spawn(
    "node",
    [
      require.resolve("pouchdb-server"),
      "--host",
      host,
      "--port",
      port.toString(),
      "--dir",
      dbDirPath,
      // TODO: use '--no-stdout-logs' when it will be fixed
      // https://github.com/pouchdb/pouchdb-server/issues/115
      "-n"
    ],
    {
      // change working directory to db dir so log file will be created there
      // and not in current dir by default ('pouchdb-server' does not provide
      // special CLI arg, but config file option only)
      cwd: dbDirPath
    }
  );

  const prefix = "[pouchdb-server] ";

  ps.stdout.on("data", data => stdout.write(prefix + data.toString()));
  ps.stderr.on("data", data => stderr.write(prefix + data.toString()));
  ps.on("exit", code => stdout.write(`${prefix} exit (${code.toString()})`));

  console.log(
    `PouchDB server started\n` +
      `\tdb folder: ${dbDirPath}\n` +
      `\tlistening at ${host}:${port}`
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
