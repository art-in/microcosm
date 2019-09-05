1. ~~Chrome does not redraw textPath on path change when <text> and <defs> are in different <g>-groups.~~
    Force redraw by setting random id attr.  
    http://stackoverflow.com/questions/11573694/svg-textpath-not-visible-after-transition-on-chrome  
    UPDATE: microcosm hack removed.

---

2. SVG animation (SMIL) deprecation in favor of CSS animation is postponed by Chrome, 
    because some cases does not have CSS replacement.  
    https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/5o0yiO440LM%5B126-150%5D

    Which means eventually SMIL will be deprecated, but for now it is the only option in some cases.  
    Which means eventually SMIL should be rewritten with CSS animation.  

    Edge is not planning to support SMIL at all.
---

3. It is impossible to fill SVG elements with gradient using CSS gradient,
    it needs `linearGradient` SVG element.  
    https://stackoverflow.com/questions/14051351/svg-gradient-using-css

---

4. Pseudo elements `:before` and `:after` are not supported by SVG `text` element.  
    https://github.com/w3c/svgwg/issues/125

---

5. CSS `box-shadow` does not work for SVG elements.  
    Drop shadow for SVG elements can be implemented with SVG `<filter>` element.  
    But `<feDropShadow>` is extremely slow in Chrome v63/FF v57 when applied to circle rendered to full screen
    (very long `Compose Layers` phase of painting).  
    https://stackoverflow.com/questions/6088409/svg-drop-shadow-using-css3

    **Workaround**: use CSS `text-shadow` which works for SVG `text`, and gradients with transparency for other primitives.  
    Cons: `text-shadow` on SVG does not work in Edge v41, and renders with artifacts in FF v57.

---

6. No good way of animating lines (movement along the line from start to tail):  

    - animate gradient of line `fill`  

        - animate offsets of gradient `<stop>`s with SMIL `<animate>`  
            - (pros) works in Chrome and FF
            - (pros) fast enough (~20% of event loop time on Rendering+Painting for 10 lines in Chrome)
            - (cons) does not work in Edge
            - (cons) SMIL will be eventually deprecated in Chrome/FF #2

        - animate `<stop>` colors with CSS animation (hack, since stop offset is not accessible from CSS)  
        http://jsbin.com/wetivek/1/edit?html,css,output  
            - (pros) works everywhere  
            - (cons) blurry image (needs at least 10 stop colors to have more or less clear borders between colors),  
            - (cons) very slow (~50% of event loop time on Rendering+Painting for 10 lines and 10 gradient stops in Chrome)   
    - animate pattern of line `fill`  
    http://jsbin.com/cuwidoj/3/edit?html,css,output  
        - (pros) fast enough (~20% of event loop time on Rendering+Painting for 10 lines in Chrome)  
        - (cons) does not work in FF and Edge.  
            FF and Edge do not animate transform of elements inside SVG `<defs>` with CSS according to the SVG spec, although Chrome does.    
            https://greensock.com/forums/topic/13423-svg-pattern-transform-browser-compatibility/?do=findComment&comment=57279  
        - (cons) Edge randomly fails to draw pattern correctly when dynamically changing angle of line and pattern  

    - animate offset of line `stroke` (with `stroke-dasharray` and `stroke-dashoffset`)  
    http://jsbin.com/mesonu/4/edit?html,css,output  
        - (pros) fast enough (?)  
        - (cons) dashes are affected by changes to viewbox size (on zoom or resize), which looks really nasty  
        - (cons) stroke is already used as invisible extender of hovering area

---

7. CSS transformations on SVG elements is not supported in Edge v41 (while ok in Chrome and FF).  
https://stackoverflow.com/questions/34434005/svg-transform-property-not-taking-acount-in-ie-edge  
https://wpdev.uservoice.com/forums/257854-microsoft-edge-developer/suggestions/6820655-add-css-transforms-on-svg-elements  

    **Workaround**: use `transform` attribute on SVG element.

---

8. CSS transition does not work when changing SVG `transform` attribute in FF v58.  
    Ie. apply CSS transition for `transform` prop, change transformation in `transform` attribute.  
    If you define transformation through CSS instead of attribute (both transformation and transition are in CSS)
    it will work in FF, but not in Edge - CSS `transform` does not work on SVG elements in Edge (see #7)

    https://bugzilla.mozilla.org/show_bug.cgi?id=1435443  
    http://jsbin.com/sekasid/edit?html,output

    **Workaround**: set same transformation to both `transform` attribute and CSS `transform` prop
    (Chrome, FF and Edge will transform, but all except Edge will animate).

---

9. SVG `stroke-width` affects element size, and there is not spec way to fix it.  
    Eg. for HTML elements you would use `outline` which does not affect size,
    or `box-sizing: border-box` to inject border into block size.  
    `stroke-alignment` prop was rejected from the spec.  

    https://stackoverflow.com/questions/7241393/can-you-control-how-an-svgs-stroke-width-is-drawn