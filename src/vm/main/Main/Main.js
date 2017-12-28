import initProps from 'utils/init-props';
import ViewModel from 'vm/utils/ViewModel';

import MindsetType from 'vm/main/Mindset';

/**
 * Main view model
 * 
 * Represents root app component, that can show
 * login form, preferences form, mindset etc.
 */
export default class Main extends ViewModel {

    /**
     * Screen type
     * @type {string|undefined}
     */
    screen = undefined;

    /**
     * Mindset view model
     * @type {MindsetType|undefined}
     */
    mindset = undefined;
    
    /**
     * Constructor
     * @param {Partial<Main>} [props]
     */
    constructor(props) {
        super();
        initProps(this, props);
    }
}