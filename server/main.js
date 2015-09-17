Promise.resolve().then(() => {
  return System.import('server/publications/ideas');
}).then(() => {
  return System.import('server/publications/assocs');
});