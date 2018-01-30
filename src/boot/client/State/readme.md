Application state

---

State consists of several layers:
- Data **(D)**
- Model **(M)**
- View Model **(VM)**
- View **(V)**

Layers represent _same entities_ in different forms:  
**(D)** holds 'frozen' entities, on **(M)** they come to live, and on **(VM)** and **(V)** they bloom.  

Each layer converts entities to appropriate state, so its easier to work with them on that layer: 
- on **(D)** they should be compact and normalized plain objects so they can be effectively stored,
- on **(M)** they should create objects graph of idea/association models - 
  to fully represent domain idea of ideas bound with associations, and be ready for various on-graph algorithms,
- on **(VM)** they converted to representational picture of nodes/links, 
  and it contains only small slice of all entities - only ones that are currently visible 
  (eg. zooming-out should shade out some deep nodes removing them from vm, etc.),
- and on **(V)** they become circles and lines on rendering surface
