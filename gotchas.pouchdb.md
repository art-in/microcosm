> History log of bugs / unsupported-features / surprising-but-valid-behaviors and other difficulties faced while using `pouchdb` in this project.  

---

1. No API to check if local database was already created and replicated from remote database.  
    Checking existance of local `indexed db` manually will not work since `pouchdb` will always create that before attempt to replicate from remote.    
    https://stackoverflow.com/questions/38541859/pouchdb-check-if-local-database-exists  
    **Workaround**: using handmade `localStorage` key.  

---

2. No API to check if live sync connection between databases was lost/restored.  
    That's odd, since `pouchdb` definitely knows when connection is down (it starts retry process),
    but there is no `connected` / `disconnected` events to check that outside.  
    https://stackoverflow.com/questions/26892438/how-to-know-when-weve-lost-sync-with-a-remote-couchdb  
    **Workaround**: initiate separate handmade polling  

---

3. Http error spam when first replicating from remote database.  
    `GET http://127.0.0.1:5984/ideas/_local/lgzYsKxEw9URK.6bq_9wmA%3D%3D? 404 (Not Found).`  
    `The above 404 is totally normal. PouchDB is just checking if a remote checkpoint exists.`  
    Well it is not normal for me to see those errors in console.  
    That actually could be avoided by placing another API endpoint on server that always exists for such checks.  

