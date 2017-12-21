import React, {Component} from 'react';

import MainVmType from 'vm/main/Main';
import Mindmap from '../Mindmap';

import classes from './Main.css';

/**
 * @typedef {object} Props
 * @prop {MainVmType} main
 * 
 * @extends {Component<Props>}
 */
export default class Main extends Component {

    render() {
        
        const {main: mainVM} = this.props;

        let pageComponent;
        switch (mainVM.screen) {
        case 'mindmap':
            pageComponent = <Mindmap mindmap={mainVM.mindmap} />;
            break;
        default:
            throw Error(`Unknown screen type '${mainVM.screen}'`);
        }

        return (
            <main className={classes.root}>
                {pageComponent}
            </main>
        );
    }
}