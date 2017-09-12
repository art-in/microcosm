Graph algorithms

---

Input graphs should be object graphs of nodes and links objects.  
Nodes and links objects should follow these interfaces:

Node:  

```javascript
interface Node {

    /**
     * Incoming links
     * @type {array.<Link>}
     */
    linksIn

    /**
     * Outgoing links
     * @type {array.<Link>}
     */
    linksOut
}
```

Link:  

```javascript
interface Link {

    /**
     * Head node
     * @type {Node}
     */
    from,

    /**
     * Tail node
     * @type {Node}
     */
    to
}
```
---

TODO: consider using typescript for interface checks

---