importSeq([
  'server/lib/helpers/meteorHelpers',
  'server/publications/ideas',
  'server/publications/assocs',
  'server/publications/mindmaps',
  'server/api/Mindmap'
]);

function importSeq(modules) {
  modules.reduce((prev, cur) =>
    prev.then(System.import.bind(System,cur)), Promise.resolve());
}
