import React, {Component, PropTypes} from 'react';

export default class Svg extends Component {

    static propTypes = {
        nodeRef: PropTypes.func,
        children: PropTypes.arrayOf(PropTypes.element)
    }

    render() {

        const {nodeRef, ...other} = this.props;

        return (

            <svg ref={nodeRef} {...other}>

                { this.props.children }

            </svg>
        );
    }

}