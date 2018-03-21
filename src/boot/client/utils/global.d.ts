declare global {
  /** Datetime string in ISO 8601 format */
  type DateTimeISO = string;

  type MindsetDatabases = Databases;
}

interface Databases {
  mindsets: PouchDB.Database,
  ideas: PouchDB.Database,
  associations: PouchDB.Database
}

export default Object;
