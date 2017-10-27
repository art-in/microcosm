client startup logic

---

**why other folders like data/model/etc are not inside client folder?**

currently most of folders outside client/server folders used only by client,  
but it does not mean they should be inside client folder, because
their logic can be used on server in future.  
eg. for creating rest api server can use data/model/action

so consider other folders as shared between client and server.

---

TODO: add favicon. to get rid of console error
"Failed to load resource: the server responded with a status of 404 (Not Found)"