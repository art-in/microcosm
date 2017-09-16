import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import MindmapVM from 'vm/main/Mindmap';

import Graph from 'view/map/entities/Graph';
import ContextMenu from 'view/shared/ContextMenu';
import ColorPicker from 'view/shared/ColorPicker';

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