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


