Utils to work with application state.  

---

**Store** is container for state.  

State wrapped in store cannot be changed directly, but only through patches produced by action handlers.

**Patch** is group of mutations.  
**Handler** is group of registered action handlers that produce patches.  

action handler defines _what_ should be changed in state.    
mutator defines _how_ state should be changed.

---

--(action)--> {{ store **[action handler]** --(patch, old state)--> **[mutator]** }} --(new state)-->