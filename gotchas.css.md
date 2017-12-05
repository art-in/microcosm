> History log of bugs / unsupported-features / surprising-but-valid-behaviors and other difficulties faced while using `css` in this project.  

---

1. `width: 0` with `box-sizing: border-box` will still show paddings and borders.  
    because with `border-box` we not really setting size of border+padding+content,  
    we still setting size of just content, but telling browser to absorb border and padding into content.  
    https://stackoverflow.com/questions/11142330/why-does-box-sizing-border-box-still-show-the-border-with-a-width-of-0px
