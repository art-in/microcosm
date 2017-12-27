1. ~~Chrome does not redraw textPath on path change when <text> and <defs> are in different <g>-groups.~~
    Force redraw by setting random id attr.  
    http://stackoverflow.com/questions/11573694/svg-textpath-not-visible-after-transition-on-chrome  
    TODO: search for or file a bug to Chrome  
    UPDATE: microcosm hack removed.

---

2. SVG animation (SMIL) deprecation in favor of CSS is postponed by Chrome,  
    because some cases does not have CSS replacement.  
    Which means eventually SMIL will be deprecated, but for now it is the only option.  
    Which means eventually SMIL should be rewritten to CSS.  
   https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/5o0yiO440LM%5B126-150%5D

    And since Edge will not plan to support SMIL, there is no reason to use it.  

    TODO: how about animated gradients on SVG elements which has no replacement in CSS?
---

3. It is impossible to fill SVG elements with gradient using only CSS,
    it needs `linearGradient` SVG element.  
    And if you want to animate that gradient you would need SMIL animation (#2).  
    https://stackoverflow.com/questions/14051351/svg-gradient-using-css

---

4. Pseudo elements `:before` and `:after` are not supported by SVG `text` element.  
    https://github.com/w3c/svgwg/issues/125

---

5. CSS `box-shadow` does not work for SVG elements.  
    Drop shadow for SVG elements can be implemented with SVG `filter` element.  
    From my research (Chrome v63, FF v57), when setting filter over circle scaled to full screen - 
    browser starts behave very slow (very long `Compose Layers` phase of painting).  
    https://stackoverflow.com/questions/6088409/svg-drop-shadow-using-css3

    **Workaround**: use CSS `text-shadow` which works for SVG `text`, and gradients with transparency for other primitives.  