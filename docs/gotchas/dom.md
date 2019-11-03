1. Detecting when target element looses focus (including its children).  

    DOM focus is not inheritable, so parent and child get focus separately.  

    **Solution**:
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

---

3. Chrome for Android can generate constant flow of `pointermove` events even if there is no movement (`movementX, movementY == 0`).  
It depends on device. I'm seeing this on Xperia Z1, but not on Nexus 7.

---

4. New line characters in textarea (LF vs CRLF).

    All current browsers handle it consistently by standard:

    - raw value (whatever user copy-pasted): LF or CRLF
    - API value (when accessing `.value`, `.length`): LF
    - submission value (when posting form): CRLF

---

5. Implementing rich editor behavior for DOM inputs is pain.

    Eg. indenting with tab key (+ shift-tab for removing indents).

    It conflicts with standard behavior of moving focus between elements, but indentation is much more valuable behavior for editors so we should override here.

    Only native solution available is `document.execCommand('indent', ...)`:
      - inserts `blockquote` element with `margin` style instead of spaces/tabs
      - doesn't work with `textarea` (but works with `contenteditable div`)
      - adds indent to the start of the line, but not to current carriage position

    **Solution**: update textarea value by string manipulation (eg. insert spaces to certain places).

    All current browsers (Chrome, FF, Edge) clear undo/redo buffer after changing `.value`:  
    https://bugs.chromium.org/p/chromium/issues/detail?id=1020840  