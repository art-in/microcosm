import React, {Component} from 'react';

import MainVmType from 'vm/main/Main';
import Mindmap from '../Mindmap';

import classes from './Main.css';

/**
 * @typedef {object} Props
 * @prop {MainVmType} vm
 * 
 * @extends {Component<Props>}
 */
export default class Main extends Component {

    render() {

        return (
            <main className={classes.root}>
                {
                    !this.props.vm.mindmap &&
                    <div>Loading...</div>
                }

                {
                    this.props.vm.mindmap &&
                    <Mindmap mindmap={ this.props.vm.mindmap } />
                }
            </main>
        );
    }
}