import React from 'react';
import {create as jssCreate} from 'jss';
import jssNested from 'jss-nested';
import reactJss from 'react-jss';

const jss = jssCreate();
jss.use(jssNested);

const useSheet = reactJss(jss);

export function createClassWithCSS(reactClass) {
    var css = reactClass.css;

    if (css) {
        reactClass.css = function() {
            return this.props.sheet.classes;
        };

        return useSheet(React.createClass.apply(React, arguments), css);
    }

    return React.createClass.apply(React, arguments);
}
