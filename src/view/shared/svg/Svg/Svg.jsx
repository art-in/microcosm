// @ts-nocheck

import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Svg extends Component {

    static propTypes = {
        nodeRef: PropTypes.func,
        children: PropTypes.arrayOf(PropTypes.element),
        className: PropTypes.string
    }

    render() {

        const {nodeRef, className, ...other} = this.props;

        return (

            <svg className={className}
                ref={nodeRef}
                {...other}>

                { this.props.children }

            </svg>
        );
    }

}