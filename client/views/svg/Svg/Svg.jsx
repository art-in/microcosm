import React, {Component} from 'react';

export default class Svg extends Component {

    render() {

        let {classes, ...other} = this.props;

        return (

            <svg {...other}>

                { this.props.children }

            </svg>
        );
    }

}