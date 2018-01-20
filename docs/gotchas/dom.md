1. Detecting target element looses focus (including its children).  
    DOM focus is not inheritable, so parent and child get focus separately.  

    - listen to `focusout` event on the parent (`blur` wont work as it does not bubble)
    - when `focusout` bubbled to parent, check `event.relatedTarget` for new focus target
    - if new focus target is not parent and not its deep child, then focus is lost
    - check deep children by traversing `element.parentNode` from focus target recursively up until parent (child) or document body (not child)
    - set `tabindex="0"` attribute to parent, so focus stay on target when clicking on children that do not receive focus by default (`div`s, `spans`s, etc.), otherwise focus will fly to document body


