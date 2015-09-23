import ViewModelComponent from 'client/views/shared/ViewModelComponent';
import MindmapVM from 'client/viewmodels/Mindmap';
import Graph from './graph/Graph';
import ContextMenu from './misc/ContextMenu';
import ColorPicker from './misc/ColorPicker';

export default React.createClassWithCSS({

  displayName: 'Mindmap',

  mixins: [ViewModelComponent],

  propTypes: {
    mindmap: React.PropTypes.instanceOf(MindmapVM).isRequired
  },

  getViewModel() {
    return {mindmap: this.props.mindmap};
  },

  css: {
    container: {
      'outline': '1px solid red',
      'height': '100%',
      'position': 'relative'
    }
  },

  render() {

    let {mindmap, className, ...other} = this.props;

    return (
      <div id={ this.constructor.displayName }
           className={ cx(this.css().container, className) }
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
