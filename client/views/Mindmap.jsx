import React from 'react';
import cx from 'classnames';

import {createClassWithCSS} from 'client/lib/helpers/reactHelpers';

import ViewModelComponent from 'client/views/shared/ViewModelComponent';
import DisplayNameAttribute from './shared/DisplayNameAttribute';
import MindmapVM from 'client/viewmodels/Mindmap';
import Graph from './graph/Graph';
import ContextMenu from './misc/ContextMenu';
import ColorPicker from './misc/ColorPicker';

export default createClassWithCSS({

    displayName: 'Mindmap',

    mixins: [DisplayNameAttribute, ViewModelComponent],

    propTypes: {
        mindmap: React.PropTypes.instanceOf(MindmapVM).isRequired
    },

    getViewModel() {
        return {
            mindmap: this.props.mindmap
        };
    },

    css: {
        container: {
            outline: '1px solid red',
            height: '100%',

            // Context menus are positioned relatively to Mindmap container.
            // Graph sends right-click positions relative to its container.
            // To avoid menus shift - Graph and Mindmap should equal at top-left,
            // otherwise wrap Graph and context menus in separate container.
            position: 'relative'
        }
    },

    render() {

        let {mindmap, className, sheet, ...other} = this.props;
        
        return (
            <div className={ cx(this.css().container, className) }
                {...other}>

                <Graph graph={ mindmap.graph } />

                <div id={'menus'}>
                    <ContextMenu menu={ mindmap.nodeMenu } />
                    <ContextMenu menu={ mindmap.linkMenu } />
                    <ColorPicker picker={ mindmap.colorPicker } />
                </div>

            </div>
        );
    }

});
