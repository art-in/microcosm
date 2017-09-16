View-model layer contains plain code essense of UI/UX, without specifics of rendering.  

It should be possible to swap (or add) view implementation later 
(for whatever hard predictable reasons), 
without touching view-model behavior.
Eg:  
- from SVG to Canvas, 
- from React to *Even Better Renderer*, 
- from HTML to native, 
- etc.
