1. Service worker (SW) is installed for origin (`scheme + host + port`) + scope (`path`).  
    Therefore same origin can have several SWs, in case they have different scopes.  

---

2. SW is able to intercept target page requests (`fetch` event) only if that
    page is recognized as SW client.  

    Page is SW client if it is located at the same level or below SW scope.  
    SW scope is directory where it is was loaded from and every sub-folders below.  

    So even if target page references resources which URLs are in SW scope,
    it does not matter if page itself is outside SW scope - none of page resources
    including page itself will be intercepted by SW.

    https://stackoverflow.com/a/48886857/1064570

---

3. SW update process.  

    Browser requests SW script everytime it navigates to page controlled by SW
    (and also everytime `push` event received).  
    But those requests can be resolved by browser HTTP cache, without call to server.  

    There is no background service that updates SW each 24 hours.  
    Spec "24 hours" is about max duration in HTTP cache, which limits cache duration
    if server sets `max-age` greater than 24 hours.  

    By default, browser will request SW from server with `no-cache` header, which disables
    HTTP cache for SW script.

    https://stackoverflow.com/questions/38843970/service-worker-javascript-update-frequency-every-24-hours
