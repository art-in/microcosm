declare global {
  // Datetime string in ISO 8601 format
  type DateTimeISO = string;

  type MindsetDatabases = Databases;

  // TODO: use aliases to avoid type definitions bug
  // https://github.com/pouchdb/pouchdb/issues/7274
  type PouchDB_Database = PouchDB.Database;
  type PouchDB_Replication_ReplicateOptions = PouchDB.Replication.ReplicateOptions;
}

interface Databases {
  mindsets: PouchDB.Database,
  ideas: PouchDB.Database,
  associations: PouchDB.Database
}

export default Object;
