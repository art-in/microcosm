import React from 'react';
import cx from 'classnames';
import {createClassWithCSS} from 'client/lib/helpers/reactHelpers';

import DisplayNameAttribute from '../shared/DisplayNameAttribute';
import Point from 'client/viewmodels/misc/Point';
import {reversedPathIdPostfix} from './Line';

export default createClassWithCSS({

    displayName: 'Text',

    mixins: [DisplayNameAttribute],

    propTypes: {
        text: React.PropTypes.string,
        align: React.PropTypes.string, // start / middle / end
        pos: React.PropTypes.instanceOf(Point), // position dep on client area or path
        href: React.PropTypes.string, // id of path to draw text on
        offset: React.PropTypes.number, // offset from start of the path
        reverse: React.PropTypes.bool // draw from start of the path or from end
    },

    getInitialState() {
        return {
            text: ''
        };
    },

    componentWillReceiveProps(nextProps) {
        this.setState({
            pos: 0,
            text: nextProps.text
        });
    },

    componentWillMount() {
        this.setState({
            text: this.props.text
        });
    },

    css: {
        root: {
            '-webkit-user-select': 'none'
        }
    },

    render() {

        let {
            text,
            align,
            pos,
            href, offset, reverse,
            className,
            sheet,
      ...other} = this.props;

if (offset && !href) {
    console.warn('Offset only makes sense with href');
}

if (reverse && !href) {
    console.warn('Reverse only makes sense with href');
}

// React does not (want to?) support namespaced attributes...
// In 0.14 we will use 'xlinkHref' and for now go with 'dangerouslySetInnerHTML'
// https://github.com/facebook/react/issues/2250

// Chrome does not redraw textPath on path change
// when <text> and <defs> are in different <g>-groups ...
// Force redraw by setting random id attr.
return (
    <g {...other}
        dangerouslySetInnerHTML={{
            __html: `

          <text id='${Math.random()}'
                text-anchor='${align || ''}'
                x='${pos ? pos.x : ''}'
                y='${pos ? pos.y : ''}'
                class='${cx(this.css().root, className) || ''}'>` +

            (href ?

                `<textPath
              xlink:href='#${reverse ? href + reversedPathIdPostfix : href}'
              startOffset='${offset || ''}%'>
            <tspan
              dx='${(pos && pos.x) || ''}'
              dy='${(pos && pos.y) || ''}'>
              ${this.state.text || ''}
            </tspan>
          </textPath>`

                : `${this.state.text || ''}`) +

            `</text>`
        }} />
);
  }

})