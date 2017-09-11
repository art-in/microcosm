Graph algorithms

---

Input graphs should be structures of nodes and links objects.  
Nodes and links can be objects of any type, but they should follow certain interface (ie. should have certain properties).

```javascript
interface Node {

    /**
     * List of outgoing links
     * @type {array.<Link>}
     */
    links
}

interface Link {

    /**
     * Starting node
     * @type {Node}
     */
    from,
    
    /**
     * Target node
     * @type {Node}
     */
    to
}
```
---

TODO: consider using typescript for interface checks

---