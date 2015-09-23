const attributeName = 'name';

export default {

  componentDidMount() {
    addNameAttribute.call(this);
  },

  componentDidUpdate() {
    addNameAttribute.call(this);
  }

};

function addNameAttribute() {
  if (!this.constructor.displayName) {
    console.warn(`Add displayName property to component`);
    return;
  }

  let el = React.findDOMNode(this);

  if (el.hasAttribute(attributeName)) {
    // already has that
    return;
  }

  let elementAttrs = el.attributes;
  let attrs = [];

  // To add attribute as first one (leftmost on Elements tab),
  // here is a little detach/inject/attach hack.

  // detach all attributes
  for (let i = elementAttrs.length - 1; i >= 0; i--) {
    let attr = elementAttrs[i];
    attrs.push(attr);
    elementAttrs.removeNamedItem(attr.name);
  }

  // inject
  let attr = document.createAttribute(attributeName);
  attr.value = this.constructor.displayName;
  elementAttrs.setNamedItem(attr);

  // attach back
  attrs.reverse();
  attrs.forEach(a => elementAttrs.setNamedItem(a));
}