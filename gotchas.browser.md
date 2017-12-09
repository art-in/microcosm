> History log of bugs / unsupported-features / surprising-but-valid-behaviors and other difficulties faced while using browser APIs (`css` / `dom`) in this project.  

---

1. `width: 0` with `box-sizing: border-box` will still show paddings and borders.  
    because with `border-box` we not really setting size of border+padding+content,  
    we still setting size of just content, but telling browser to absorb border and padding into content.  
    https://stackoverflow.com/questions/11142330/why-does-box-sizing-border-box-still-show-the-border-with-a-width-of-0px

---

2. ~~Chrome does not redraw textPath on path change when <text> and <defs> are in different <g>-groups.~~
    Force redraw by setting random id attr.  
    http://stackoverflow.com/questions/11573694/svg-textpath-not-visible-after-transition-on-chrome  
    TODO: search for or file a bug to Chrome  
    UPDATE: microcosm hack removed.

---

3. Chrome finishes CSS transition of `opacity` block style immediately when focusing `input` in that block
    (via DOM API `input.focus()` or `autofocus` attribute).  
    I guess it actually makes sense. Focusing input that can be in the middle of maybe long-running transition
    ruins very idea of 'focusing user attention' - it should be immediate.  
    TODO: did not found any spec/discussions on this point though.