import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import LookupPopupVM from 'vm/shared/LookupPopup';

import Popup from '../Popup';
import Lookup from '../Lookup';

import classes from './LookupPopup.css';

export default class LookupPopup extends Component {

    static propTypes = {
        lookupPopup: PropTypes.instanceOf(LookupPopupVM).isRequired,
        className: PropTypes.string
    }

    render() {

        const {lookupPopup, className, ...other} = this.props;
        const {popup, lookup} = lookupPopup;

        return (
            <Popup popup={popup}
                className={cx(classes.root, className)}
                {...other}>

                <Lookup lookup={lookup}
                    className={classes.lookup} />
        
            </Popup>
        );
    }

}