import {createDB} from 'test/utils';

import State from 'src/boot/client/State';

import Mindset from 'src/model/entities/Mindset';
import Point from 'src/model/entities/Point';
import MainVM from 'src/vm/main/Main';
import MainScreen from 'vm/main/MainScreen';
import MindsetVM from 'src/vm/main/Mindset';
import VersionVM from 'src/vm/main/Version';
import MindsetViewMode from 'vm/main/MindsetViewMode';
import Icon from 'vm/shared/Icon';

import toMindmap from 'vm/map/mappers/mindset-to-mindmap';
import NodeLocator from 'vm/map/entities/NodeLocator';

/**
 * Creates clean test-ready state
 * @return {State} state
 */
export default function createState() {
  const state = new State();

  // data
  state.data.ideas = createDB();
  state.data.associations = createDB();
  state.data.mindsets = createDB();

  // model
  state.model.mindset = new Mindset();

  // view model
  const mindmap = toMindmap({
    mindset: state.model.mindset,
    center: new Point({x: 50, y: 50}),
    scale: 1
  });
  mindmap.debug.enable = false;
  mindmap.viewbox.topLeft.x = 0;
  mindmap.viewbox.topLeft.y = 0;
  mindmap.viewport.width = 100;
  mindmap.viewport.height = 100;
  mindmap.focusNodeLocator = new NodeLocator({
    pos: new Point({x: 0, y: 0}),
    scale: 1
  });

  const mindset = new MindsetVM({
    isLoaded: true,
    mode: MindsetViewMode.mindmap,
    mindmap,
    toggleModeButton: {
      icon: Icon.list,
      tooltip: ''
    }
  });

  const version = new VersionVM({
    name: 'microcosm',
    homepage: 'http://example.com',
    version: '0.0.0'
  });

  state.vm.main = new MainVM({
    screen: MainScreen.mindset,
    mindset,
    version
  });

  // view
  state.view.root = window.document.createElement('div');
  state.view.storeDispatch = () => {};

  // append view root to DOM so Portals can find their containers
  window.document.body.appendChild(state.view.root);

  return state;
}
