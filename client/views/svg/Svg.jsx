import React from 'react';
import {createClassWithCSS} from 'client/lib/helpers/reactHelpers';

export default createClassWithCSS({

    render() {

        return (
            <svg {...this.props}>

                { this.props.children }

            </svg>
        );
    }

});