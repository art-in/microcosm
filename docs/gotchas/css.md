1. `width: 0` with `box-sizing: border-box` will still show paddings and borders.  
    because with `border-box` we not really setting size of border+padding+content,  
    we still setting size of just content, but telling browser to absorb border and padding into content.  
    https://stackoverflow.com/questions/11142330/why-does-box-sizing-border-box-still-show-the-border-with-a-width-of-0px

---

2. Chrome finishes CSS transition of `opacity` block style immediately when focusing `input` in that block  
    (via DOM API `input.focus()` or `autofocus` attribute).  
    I guess it actually makes sense. Focusing input that can be in the middle of maybe long-running transition
    ruins very idea of 'focusing user attention' - it should be immediate.  
    TODO: did not found any spec/discussions on this point though.

---  

3. No way to set CSS `transform` functions separately.  
    eg. first add `transform: translate() rotate()`, later add scaling `transform: scale()` - and that will cancel both `translate` and `rotate` since entire `transform` will be overriden.  
    https://stackoverflow.com/questions/5890948/css-transform-without-overwriting-previous-transform  
    __Workaround__: distribute several transformations between several wrappers.  

---

4. CSS transitions of style properties will not run if there is no change of that property (obviously).  
    One should first add starting styles and then change it to target styles.  
    If add target styles too fast after starting styles added - transition will not run.  
    Browser should first paint starting styles, after that you can add target styles.  
    There is following techniques for waiting for starting styles paint:  
    - `requestAnimationFrame` - wait for frame of starting styles
      then wait for another frame of target styles
    - force repaint/reflow node (hack) - eg. `node.scrollTop`  

    http://jsbin.com/mumujof/edit?js,output

---

5. CSS `attr` is not supported to be used inside any CSS property except `content`.  
    Which blocks passing values from script to CSS rules through custom attributes.  
    Eg. when view component needs to set view model value to styles (eg. `color`), it needs to set it through inline `style`.  
    But it will not work for hovering, since hovering cannot be expressed through inline styles but only through CSS.  

    **Workaround**: use CSS custom properties (variables):
    1. set value of custom prop from script (eg. `el.style.setProperty(--my-color)`),
    2. use custom prop value in target CSS property (eg. `.el:hover {color: var(--my-color)}`).

---

6. Align text to the right and cut on the left with ellipsis.  
    https://stackoverflow.com/questions/9793473/text-overflow-ellipsis-on-left-side  

    - `direction:rtl` and `text-overflow:ellipsis`  
        http://jsbin.com/socemoy/edit?html,css,output  
        Cons: does not work in Edge 41 - ellipsis added on the left, but text still truncated on the right
    - inner container + `float:right`  
        http://jsbin.com/rawoqon/edit?html,css,output  
        Cons: additional container, ellipsis always visible, ellipsis background always white

