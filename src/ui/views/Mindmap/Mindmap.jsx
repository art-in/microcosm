import React, {Component, PropTypes} from 'react';
import cx from 'classnames';

import MindmapVM from 'ui/viewmodels/Mindmap';

import Graph from '../graph/Graph';
import ContextMenu from '../misc/ContextMenu';
import ColorPicker from '../misc/ColorPicker';

import classes from './Mindmap.css';

export default class Mindmap extends Component {

    static propTypes = {
        mindmap: PropTypes.instanceOf(MindmapVM).isRequired,
        className: PropTypes.string
    };
    
    render() {

        const {mindmap, className, ...other} = this.props;
        
        return (
            <div className={ cx(classes.container, className) }
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

}