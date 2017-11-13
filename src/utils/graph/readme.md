Graph algorithms

---

Properties of target graph:
- rooted
- weighted
- directed

---

Graph representation.  

Graph represented as [adjacency list](https://en.wikipedia.org/wiki/Adjacency_list)
in object oriented style: nodes and links are objects of special classes (interfaces below).

Q: why adjacency list and not adjacency matrix?  
A: list is more efficient in space and time than matrix
   if we work with large sparse graphs (ie. graphs with relatively small number of links).  
- matrix consumes more memory than list  
  (matrix needs n^2 space, while list - number of nodes + links),
- code serving matrix is less performant  
  (searching node links with matrix is O(n), while with list - 
   proportional to degree of node),
- code serving matrix going to be less readable (I guess).

---

Tree inside the graph.

Upon the graph there is minimum spanning tree (MST) with same root as graph.  
MST defines tree where each node in the graph can be reached from root
by path of minimum possible weight.

As such, each node besides incoming and outgoing links (graph structure), 
also has reference to parent and child links in MST (tree structure).  
Link from parent - is incoming link that is part of minimum root path.

This allows to apply on-tree algorithms to any node in the graph,
since any node is also root for sub-tree underneath.

---

Nodes and links objects should follow these interfaces.

// TODO: fix terminology. use more general terms Vertices and Edges.
//       to clearly distinguish models, view-models and generic graph entities.

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
     * Link from parent node in minimum spanning tree (MST).
     * One of incoming links.
     * @type {Link}
     */
    linkFromParent

    /**
     * Links to child nodes in minimum spanning tree (MST).
     * Subset of outgoing links.
     * @type {array.<Link>}
     */
    linksToChilds

    /**
     * Weight of minimal path from root (RPW)
     * @type {number}
     */
    rootPathWeight
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
    to,

    /**
     * Weight of link
     * @type {number} non-negative
     */
    weight
}
```
---

TODO: consider using typescript for interface checks

---