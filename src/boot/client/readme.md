client startup logic

---

**why other folders like data/model/etc are not inside client folder?**

currently most of folders outside client/server folders used only by client,  
but it does not mean they should be inside client folder, because
their logic can be used on server in future.  
eg. for creating rest api server can use data/model/dispatchers

so consider other folders as shared between client and server.

---