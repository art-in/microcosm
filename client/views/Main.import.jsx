import Mindmap from 'client/proxy/Mindmap';
import Graph from 'client/views/graph/Graph';
import { mindmapToGraph } from 'client/mappers/mindmapMapper';
import ideaMapper from 'client/mappers/ideaMapper';
import Menu from 'client/views/misc/Menu';
import MenuVM from 'client/viewmodels/misc/Menu';
import MenuItemVM from 'client/viewmodels/misc/MenuItem';
import Point from 'client/viewmodels/Point';

export default React.createClassWithCSS({

  mixins: [ReactMeteorData],

  propTypes: {
    mindmap: React.PropTypes.instanceOf(Mindmap).isRequired
  },

  getInitialState() {
    return {
      contextMenu: {
        on: false,
        pos: null,
        node: null,
        def: new MenuVM([
          new MenuItemVM('add'),
          new MenuItemVM('delete')
        ])
      }
    };
  },

  getMeteorData() {
    let mindmap = this.props.mindmap;

    if (mindmap.loaded) {
      return {
        graph: mindmapToGraph(mindmap),
        loaded: true
      };
    }

    return {
      loaded: false
    };
  },

  onNodeContextMenu(node, pos) {
    this.state.contextMenu.on = true;
    this.state.contextMenu.pos = pos;
    this.state.contextMenu.node = node;
    this.forceUpdate();
  },

  onGraphClick() {
    this.state.contextMenu.on = false;
    this.forceUpdate();
  },

  onNodeContextMenuClick(menuItem) {
    console.log('context menu click: ' + menuItem.displayValue);

    let node = this.state.contextMenu.node;

    switch (menuItem.displayValue) {
      case 'add': this.onNodeAdd(node); break;
      case 'delete': this.onNodeDelete(node); break;
    }
  },

  onNodeChange(node) {
    let idea = ideaMapper.nodeToIdea(node);
    this.props.mindmap.updateIdea({idea});
  },

  onNodeAdd(parentNode) {
    let parentIdea = ideaMapper.nodeToIdea(parentNode);
    this.props.mindmap.createIdea({parentIdeaId: parentIdea.id});
  },

  onNodeDelete(node) {
    let idea = ideaMapper.nodeToIdea(node);
    this.props.mindmap.deleteIdea({ideaId: idea.id});
  },

  css: {
    main: {
      'font-family': 'Arial'
    }
  },

  render() {
    if (!this.data.loaded) {
      return (<div>Loading...</div>);
    }

    return (
      <main className={ this.css().main }>
        <Graph graph={ this.data.graph }
               onNodeChange={ this.onNodeChange }
               onNodeAdd={ this.onNodeAdd }
               onNodeContextMenu={ this.onNodeContextMenu }
               onClick={ this.onGraphClick }/>

        {(() => {
          if (this.state.contextMenu.on) {
            return <Menu menu={ this.state.contextMenu.def }
                         pos={ this.state.contextMenu.pos }
                         onItemClick={ this.onNodeContextMenuClick }/>;
          }
        })()}
      </main>
    );
  }
});
