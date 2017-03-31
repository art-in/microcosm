import React, {Component, PropTypes} from 'react';
import cx from 'classnames';

import Point from 'ui/viewmodels/misc/Point';

import {reversedPathIdPostfix} from '../Line';

import classes from './Text.css';

export default class Text extends Component {

    static propTypes = {
        text: PropTypes.string,
        align: PropTypes.string, // start / middle / end
        pos: PropTypes.instanceOf(Point), // position dep on client area or path
        href: PropTypes.string, // id of path to draw text on
        offset: PropTypes.number, // offset from start of the path
        reverse: PropTypes.bool, // draw from start of the path or from end
        className: PropTypes.string
    }

    state = {
        text: ''
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            pos: 0,
            text: nextProps.text
        });
    }

    componentWillMount() {
        this.setState({
            text: this.props.text
        });
    }

    render() {

        const {
            align,
            pos,
            href, offset, reverse,
            className,
            ...other} = this.props;

        delete other.text;

        if (offset && !href) {
            console.warn('Offset only makes sense with href');
        }

        if (reverse && !href) {
            console.warn('Reverse only makes sense with href');
        }

        // React does not (want to?) support namespaced attributes...
        // In 0.14 we will use 'xlinkHref'
        // and for now go with 'dangerouslySetInnerHTML'
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
                        class='${cx(classes.root, className) || ''}'>` +

                    (href ?

                    `<textPath
                        xlink:href=
                            '#${reverse ? href + reversedPathIdPostfix : href}'
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

}