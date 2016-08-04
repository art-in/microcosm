import React from 'react';
import {createClassWithCSS} from 'client/lib/helpers/reactHelpers';

import DisplayNameAttribute from './shared/DisplayNameAttribute';
import ViewModelComponent from 'client/views/shared/ViewModelComponent';
import MainVM from '../viewmodels/Main';
import Mindmap from './Mindmap';

export default createClassWithCSS({

    displayName: 'Main',

    mixins: [DisplayNameAttribute, ViewModelComponent],

    propTypes: {
        main: React.PropTypes.instanceOf(MainVM)
    },

    getViewModel() {
        return this.state;
    },

    getInitialState() {
        return new MainVM();
    },

    componentDidMount() {
        this.state.load();
    },

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.main);
    },

    css: {
        main: {
            'font-family': 'Arial',
            'height': '100%'
        }
    },

    render() {
        return (
            <main className={this.css().main}>
                {
                    !this.state.mindmap &&
                    <div>Loading...</div>
                }

                {
                    this.state.mindmap &&
                    <Mindmap mindmap={ this.state.mindmap } />
                }
            </main>
        );
    }
});
