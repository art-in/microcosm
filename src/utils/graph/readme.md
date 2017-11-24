Graph algorithms

---

Properties of target graph:
- rooted
- weighted
- directed

---

Graph representation.  

Graph represented as [adjacency list](https://en.wikipedia.org/wiki/Adjacency_list)
in object oriented style: vertices and edges are objects of special classes (see interfaces/).

Q: why adjacency list and not adjacency matrix?  
A: list is more efficient in space and time than matrix
   if we work with large sparse graphs (ie. graphs with relatively small number of edges).  
- matrix consumes more memory than list  
  (matrix needs n^2 space, while list - number of vertices + edges),
- code serving matrix is less performant  
  (searching vertex edges with matrix is O(n), while with list - 
   proportional to degree of vertex),
- code serving matrix going to be less readable (I guess).

---

Tree inside the graph.

Upon the graph there is minimum spanning tree (MST) with same root as graph.  
MST defines tree where each vertex in the graph can be reached from root
by path of minimum possible weight.

As such, each vertex besides incoming and outgoing edges (graph structure), 
also has reference to parent and child edges in MST (tree structure).  
Edge from parent - is incoming edge that is part of minimum root path.

This allows to apply on-tree algorithms to any vertex in the graph,
since any vertex is also root for sub-tree underneath.

---

TODO: consider using typescript for interface checks
      https://github.com/artin-phares/microcosm/issues/57

---