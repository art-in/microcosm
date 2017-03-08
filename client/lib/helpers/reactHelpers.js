import React from 'react';
import {create as jssCreate} from 'jss';
import {create as createInjectSheet} from 'react-jss';
import jssNested from 'jss-nested';

const jss = jssCreate();
jss.use(jssNested);

const injectSheet = createInjectSheet(jss);

export function createClassWithCSS(reactClass) {
    var css = reactClass.css;

    if (css) {
        reactClass.css = function() {
            return this.props.sheet.classes;
        };

        return injectSheet(css)(React.createClass.apply(React, arguments));
    }

    return React.createClass.apply(React, arguments);
}
