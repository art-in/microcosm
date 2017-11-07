Logic for presenting mindmap as geo-like map:
graph of ideas mapped to 2D space (map), with ability to zoom.  

Each node has its own 2D coordinates on the map.  
Node size is defined by its root path weight (RPW) in the graph.  
Greater RPW node has - smaller it gets on the map.  

---

Vocabulary:

 - Canvas - infinite 2D logical space containing all objects of the scene

 - Viewbox - logical rectangular fragment of canvas mapped to viewport.  
             its size and position regulated with zooming and panning.  
             aspect ratio of viewbox equals to aspect ratio of viewport.  

 - Viewport - physical rectangle surface of rendering engine (eg. browser window).