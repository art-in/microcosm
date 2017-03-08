import React from 'react';
import cx from 'classnames';

import {createClassWithCSS} from 'client/lib/helpers/reactHelpers';

import DisplayNameAttribute from '../shared/DisplayNameAttribute';
import MenuVM from 'client/viewmodels/misc/Menu';
import MenuItem from './MenuItem';

export default createClassWithCSS({

    displayName: 'Menu',

    mixins: [DisplayNameAttribute],

    propTypes: {
        menu: React.PropTypes.instanceOf(MenuVM).isRequired
    },

    css: {
        menu: {
            'border': '1px solid gray',
            'max-width': '200px',
            'background-color': 'white'
        }
    },

    render() {

        let {menu, className, sheet, classes, ...other} = this.props;

let items = menu.items.map((item) => {
    return (<MenuItem key={ item.id }
        item={ item }
        onClick={ menu.onItemSelected.bind(menu, item) } />);
});

return (
    <div className={ cx(this.css().menu, className) }
        onClick={ this.onClick }
        {...other}>

        { items }

    </div>
);
  }

})