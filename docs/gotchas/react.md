1. ~~React v0.13 does not support namespaced attributes.~~  
   And 'xlink:href' is necessary for UA to ref path from textPath.  
   In 0.14 we will use 'xlinkHref' and for now go with 'dangerouslySetInnerHTML'.  
   https://github.com/facebook/react/issues/2250  
   UPDATE: actually React team willing to support missing SVG tags/attrs  
   https://github.com/facebook/react/issues/1657  
   UPDATE: react fixed. microcosm hack removed.

---

2. When passing function closured with some data as event handler to child components,  
    that data may be expired at the moment event triggers if skipping child updates with `shouldComponentUpdate`.  

    eg. `onClick={this.onChildClick.bind(null, this.props.closuredParentProp)}`  

    If parent updated but child update was skipped - child element remains subscribed to old handler function with old parent data in closure.  
    This is totally valid, but not intuitively expected at first glance.  
    __Workaround__: if closured data is some entity object - then closure entity ID instead of entity itself.  

---

3. There is no way to update only parent component without updating child components.  
    request for `setLocalState`: https://github.com/facebook/react/issues/8598  
    __Workaround__: all child components should implement `shouldComponentUpdate` to skip their updates.

---

4. No way to stop propagation of native events with react handlers since react really catches all of them on `document` element (event delegation) - when events are already propagated to root.  
    React implements its own propagation of synthetic events for its components.  
    https://stackoverflow.com/questions/24415631/reactjs-syntheticevent-stoppropagation-only-works-with-react-events

---

5. `onChange` handler for inputs really adds handler for `input` event, not `change` event.  
    React does that because `change` event may not trigger each time input changes, but `input` event always does.  
    > Unlike the input event, the change event is not necessarily fired for each change to an element's value.   (details: https://developer.mozilla.org/en-US/docs/Web/Events/change)  
    
    https://github.com/facebook/react/issues/6087

---

6. No valid way to render `autoFocus` attribute on inputs.  
    React polyfills `autoFocus` to hide browser inconsistencies.  
    https://github.com/facebook/react/issues/3066
