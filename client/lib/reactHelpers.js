React.createClassWithCSS = function(reactClass) {
  var css = reactClass.css;

  reactClass.css = function() {
    return this.props.sheet.classes;
  };

  return useSheet(React.createClass.apply(React, arguments), css);
};
