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

---

7. `px` vs `rem`/`em`  

    Votes on using both units are quite equal.
    Everybody claims that opposite approach should die.  

    Main arguments for pixel units:
    - CSS pixel is already scaled by UA to equal spec normative pixel size - *reference pixel* - which defined as visual angle unit in spec. It should be calculated depending on hardware pixel size (DPI) and usual distance between user and device display. In practice each UA has *pixel ratio* - as ratio of hardware pixel size to CSS pixel size (eg. iPhone X pixel ratio = 4). As a result single CSS pixel should look *almost* the same on any device.  
    - all modern browsers have *zoom* feature, which changes size of reference pixel: it proportionally affects all sizes on the page (both absolute and relative units, except `vw`/`vh`). While changing default font size is less popular.

    Main arguments for relative units:  
    - relative units basically inherit all advantages of pixel unit, since both `rem`/`em` are computed down to `px`
    - relative units allow to make context-dependent layouts: `rem` allows to re-size entire layout by changing root element `font-size` while saving proportions, `em` allows to create modular components which are auto-scaled basing on parent `font-size`.
    - using relative `font-size` on root element allows to save user ability to configure default font size for all sites. This feature is a bit hidden by zoom feature, but still.

    https://stackoverflow.com/questions/11799236/should-i-use-px-or-rem-value-units-in-my-css
    https://webdesign.tutsplus.com/tutorials/comprehensive-guide-when-to-use-em-vs-rem--cms-23984
    https://mindtheshift.wordpress.com/2015/04/02/r-i-p-rem-viva-css-reference-pixel/
    https://medium.com/@julienetienne/pixels-are-dead-faa87cd8c8b9


    **Solution**: mainly go with relative units.
    - percent-relative `font-size` on root element
    - `px` for borders
    - `em` for everything that should depend on element local font size (paddings, margins, line-heights, etc.)
    - `rem` for everyting else (font sizes, absolute positions, block sizes, etc.)

---

8. Zoom in desktop and mobile browsers works differently.  

    In desktop - it is changing size of *reference pixel*, which affects all sizes on the page.  
    In mobile - it is *pitch zoom*, which slices fragment of page and maps it on the viewport.

---

9. Default font size in desktop and mobile browsers works differently.  

    In desktop - default font size is really *default font size* that will be applied to page and can be overriden by author (that's why zoom is way to go).  
    In mobile - it is changing ratio of Font Inflation (Font Boosting in Chrome for Android). Which statistically finds text blocks with text amount above some threshold, and increases font size in that blocks (https://jwir3.wordpress.com/2012/07/30/font-inflation-fennec-and-you/).

---

10. Named media queries.  

    Ability to give name for each media breakpoint and reuse it everywhere.  
    Currently you need to copy-paste breakpoints whereever `@media` is used.  

    **Workaround**: Media Queries Level 5 spec adds [Custom Media Queries](https://drafts.csswg.org/mediaqueries-5/#custom-mq), which can be polyfilled with [`postcss-custom-media`](https://github.com/postcss/postcss-custom-media).

---

11. Nesting media rules.  

    Ability to nest `@media` rule inside target css rule.  
    Currently you need to copy-paste query of target css rule into separate `@media` rule.  

    **Workaround**: [CSS Nesting Module Level 3](http://tabatkins.github.io/specs/css-nesting/) defines ability to nest any rules, including `@media` rules, and can be polyfilled with [`postcss-nesting`](https://github.com/jonathantneal/postcss-nesting).

---

12. Sticky `:hover`/`:focus` on mobiles.

    Hover styles get stuck on elements after taps.

    > Even though real hovering isn't possible on most touchscreens, most mobile browsers emulate hovering support and make :hover "sticky". In other words, :hover styles start applying after tapping an element and only stop applying after the user taps some other element. This can cause Bootstrap's :hover states to become undesirably "stuck" on such browsers. Some mobile browsers also make :focus similarly sticky. There is currently no simple workaround for these issues other than removing such styles entirely.

    https://getbootstrap.com/docs/3.3/getting-started/#support-sticky-hover-mobile