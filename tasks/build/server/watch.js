const buildConfig = require('../../../config.build');

// build will not happen until server file changed, but this is intended
// to avoid nodemon error while both watched build and server stated in
// parallel and nodemon first sees empty server folder.
// in that case it is better to run separate build before starting watch.
module.exports = gulp =>
  gulp.watch([buildConfig.src.serv.root + '/**/*.js'], ['build:server']);
