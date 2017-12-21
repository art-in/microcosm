> History log of bugs / unsupported-features / surprising-but-valid-behaviors and other difficulties faced while using `react` in this project.  

---

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
    This is totaly valid, but not intuitively expected at first glance.  
    __Workaround__: if closured data is some entity object - then closure entity ID instead of entity itself.  

---

3. There is no way to update only parent component without updating child components.  
    request for `setLocalState`: https://github.com/facebook/react/issues/8598  
    __Workaround__: all child components should implement `shouldComponentUpdate` to skip their updates.

---

4. When component update is skipped by `shouldComponentUpdate`, all child components will still be updated (#3),  
    except children that were received through props (ie. `this.props.children`), they wont be updated.  
    
    This is surprising, because not all children get updated as described in docs, but only ones defined statically, and not ones received from props dynamically.  
    TODO: why it is not mentioned in docs? why update static and not dynamic children (what's the difference)?  
    https://discuss.reactjs.org/t/shouldcomponentupdate-and-children/2055/7