import React from 'react';
import {createClassWithCSS} from 'client/lib/helpers/reactHelpers';

export default createClassWithCSS({

    render() {

        let {classes, ...other} = this.props;

        return (

            <svg {...other}>

                { this.props.children }

            </svg>
        );
    }

});