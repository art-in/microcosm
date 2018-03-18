declare global {
  type MindsetDatabases = Databases;
}

interface Databases {
  mindsets: PouchDB.Database,
  ideas: PouchDB.Database,
  associations: PouchDB.Database
}

export default Object;
