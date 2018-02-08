1. Detecting target element looses focus (including its children).  
    DOM focus is not inheritable, so parent and child get focus separately.  

    - listen to `focusout` event on the parent (`blur` wont work as it does not bubble)
    - when `focusout` bubbled to parent, check `event.relatedTarget` for new focus target
    - if new focus target is not parent and not its deep child, then focus is lost
    - check deep children by traversing `element.parentNode` from focus target recursively up until parent (child) or document body (not child)
    - set `tabindex="0"` attribute to parent, so focus stay on target when clicking on children that do not receive focus by default (`div`s, `spans`s, etc.), otherwise focus will fly to document body

---

2. No solid cross-browser support for `touch events` (TE) and `pointer events` (PE).  
    IE/Edge supports PE (was originally proposed by Microsoft), while Webkits in opposition to support it since 2012 (because "PE is over-abstraction").  
    iOS Safari supports TE, while Edge only have TE under flag, since Microsoft already made their bet on PE.  
    Chrome supports both TE and PE, both on desktop and android.  

    https://github.com/w3c/pointerevents  

    **Solution**: ignore iOS Safari, use PE with fallback to mouse events (to keep code simpler, and hoping Webkits will eventually accept PE).

