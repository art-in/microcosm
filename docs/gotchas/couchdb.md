1. CouchDB allows creating new users anonymously by default.  
  https://serverfault.com/questions/742184/couchdb-user-creation-without-authentication-standard-behavior

---

2. CouchDB allows requesting `_all_dbs` anonymously by default.  
  https://github.com/apache/couchdb/issues/1077

---

3. CouchDB cuts intermediate certificates out of `cert_file`.  
  Therefore nodejs fails to request database server with `RequestError: Error: unable to verify the first certificate`.  
  https://github.com/apache/couchdb/issues/1179  
  
    **Workaround**: pass certificate chain explicitly with `cacert_file`.  
