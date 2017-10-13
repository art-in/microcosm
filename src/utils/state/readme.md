Utils to work with application state.  

---

State consists of several layers:
- Data **(D)**
- Model **(M)**
- View Model **(VM)**
- View **(V)**

Items on layers - are just different reincarnations of _same entities_.  
**(D)** holds 'frozen' entities, on **(M)** they come to live, and on **(VM)** and **(V)** they bloom.  

Each layer converts entities to appropriate state, so its easier to work with them on that layer. 
- on **(D)** they should be compact and normalized plain objects,
- on **(M)** they should create objects graph of idea/association models - 
  to fully represent domain idea of ideas bound with associations, and be ready for various on-graph algorithms,
- on **(VM)** they converted to representational picture of nodes/links, 
  and that picture can be quite different from underlying model graph
  (eg. zooming-out should shade out some deep nodes removing them from picture, etc.),
- and on **(V)** they become circles and lines on rendering surface, to be visually presented to user

---

**Store** is application container for  state.  

State should always stay consistent - same entities are in same condition on each layer.  
To support consistency between layers state cannot be changed directly, but only through **Patch**`s.  
Each mutation always applied to each layer, so layers stay in sync.  

**Patch** is container of mutations.  
**Handler** is group of registered action handlers  

action handler defines _what_ should be changed in state    
mutator defines _how_ state should be changed

---

**[VM]** --(action)--> {{ store **[action handler]** --(patch, old state)--> **[mutator]** }} --(new state)--> **[VM]**  