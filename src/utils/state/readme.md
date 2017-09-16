Utils to work with application state.  

State consists of several layers:
- Data **(D)**
- Model **(M)**
- View Model **(VM)**
- View **(V)**

Items on layers - are just different reincarnations of __same entities__.  
**(D)** holds 'frozen' entities, on **(M)** they come to live, and on **(VM)** and **(V)** they bloom.  

Each layer converts entities to appropriate state, so its easier to work with them on that layer. 
- on **(D)** they should be compact and duplication-free plain objects,
- on **(M)** they should create objects graph of idea/association models - 
  to fully represent domain idea of ideas bound with associations, and so - to be ready for various graph algorithms,
- on **(VM)** they converted to representational picture of nodes/links, 
  and that picture can be quite different from underlying model graph
  (eg. zooming-out should shade out some deep nodes removing them from picture, etc.),
- and on **(V)** they become circles and lines on rendering surface, to be visually presented to user

**Store** is application container to the state.  

State should always stay consistent - same entities are in same condition on each layer.  
To support consistency between layers state cannot be changed directly, but only through **Patch**`s.  

**Patch** is container of mutations. Each mutation always applied to each layer, so layers stay in sync.  

**[VM]** --action--> **[store]** --action--> **[dispatcher]** --patch--> **[mutator]** --> **[state]**  