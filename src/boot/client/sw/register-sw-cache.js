// register caching service worker (SW)
// https://github.com/GoogleChromeLabs/sw-precache/blob/master/demo/app/js/service-worker-registration.js

// register SW in prod environment only, since SW generator does not support
// webpack dev server. in dev env you would typically disable cache anyway.
if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    // delay registration until after the page has loaded, to ensure that
    // precaching requests don't degrade the first visit experience.
    window.addEventListener('load', () =>
      navigator.serviceWorker.register('sw-cache.js')
    );
  }
}
