declare global {
  type EnexObject = Enex;
  type EnexResource = Resource;
}

interface Enex {
  enExport: EnExport
}

interface EnExport {
  note: Array<Note>
}

interface Note {
  title: string
  content: string
  created: string
  resource: Array<Resource>
}

interface Resource {
  data: ResourceData
  mime: string
  resourceAttributes: ResourceAttributes
}

interface ResourceData {
  _: string
  encoding: string
}

interface ResourceAttributes {
  fileName: string
}

interface EnexToObjectFunction {
  (enex: string):Enex
}

declare const enexToObject:EnexToObjectFunction;

export default Object;
