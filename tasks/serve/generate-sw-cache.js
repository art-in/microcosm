const fs = require('fs');
const gutil = require('gulp-util');
var swPrecache = require('sw-precache');
var minify = require('uglify-es').minify;
const abs = require('../utils/join-path')(__dirname);
const config = require('../../config.serve');

/**
 * Generates caching service worker (SW).
 *
 * SW will pre-cache all assets in serving folder + some additional resources.
 * All other requests will go directly to server. No resources will be lazily
 * cached (cache-first strategy).
 *
 * Q: why generate SW when serving and not at build time?
 * A: because we need to cache client config (api/config), which depends on
 *    serve config (which purpose is to configure the app away from sources)
 *
 * Q: why we need to cache client config?
 * A: because we need to support offline scenario. if it would not be SW cache,
 *    we would need to cache client config somewhere anyway (eg. in web storage)
 *
 * Q: why cache client config in SW cache and not in web storage?
 * A: because it is (a) separate app update path. ie. after client config
 *    updated from server we need to restart the app, same as when SW cache
 *    updated, what if both client config and SW cache get updated same time?
 *    single app update path means simpler design, less code and bugs.
 *    (b) it requires additional HTTP request to server (besides request to sw).
 */
module.exports = async () => {
  const rootDir = config.server.static.folder;
  const swName = 'sw-cache';

  let sw = await swPrecache.generate({
    staticFileGlobs: [
      rootDir + '**/*.{html,css,png,jpg,gif,svg,eot,ttf,woff,woff2}',
      rootDir + `**/!(${swName}).js`
    ],
    stripPrefix: rootDir,
    logger: message => gutil.log('[sw-precache]', message),
    dynamicUrlToDependencies: {
      // additional resources and their dependencies. sw-precache will get
      // hashes from them, and SW will know when to update client cache.
      'api/config': [
        abs('../../config.serve.js'),
        abs('../../config.serve.user.js'),
        abs('../../package.json')
      ]
    }
  });

  const res = minify(sw);
  if (res.error) {
    throw res.error;
  }
  sw = res.code;

  fs.writeFileSync(`${rootDir}/${swName}.js`, sw);
};
