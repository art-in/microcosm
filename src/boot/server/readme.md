server startup logic

---

Server layer is thin and aims only two purposes:  
1. Serv static assets (html/js/css/etc.) to the client browser
2. Hold master database (CouchDB compatible), which replicates with client database (PouchDB)
