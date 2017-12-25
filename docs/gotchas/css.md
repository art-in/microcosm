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

