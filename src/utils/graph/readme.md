Graph algorithms

---

Input graphs should be object graphs of nodes and links objects.  
Nodes and links objects should follow interfaces below.

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

    /**
     * Distance from root
     * @type {number}
     */
    depth
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