import initProps from 'utils/init-props';

import MindmapVmType from 'vm/map/entities/Mindmap';
import MindlistType from 'vm/list/entities/Mindlist';
import ColorPicker from 'vm/shared/ColorPicker';

import ViewModel from 'vm/utils/ViewModel';
import SearchBox from 'vm/shared/SearchBox';
import Lookup from 'vm/shared/Lookup';
import IconType from 'vm/shared/Icon';

import ConnectionState from 'action/utils/ConnectionState';
import MindsetViewModeType from 'vm/main/MindsetViewMode';

/**
 * Mindset view model
 *
 * Represents root mindset component, which can show
 * mindset in different forms (map, list, etc)
 */
export default class Mindset extends ViewModel {
  /**
   * Mindset data was loaded and mapped to view model of current view mode
   * @type {boolean}
   */
  isLoaded = false;

  /**
   * Mindset load failed
   * @type {boolean}
   */
  isLoadFailed = false;

  /**
   * View mode
   * @type {MindsetViewModeType}
   */
  mode = undefined;

  /**
   * Mindmap view model.
   * Note: only available in mindmap view mode.
   * @type {MindmapVmType|undefined}
   */
  mindmap = undefined;

  /**
   * List view model.
   * Note: only available in list view mode.
   * @type {MindlistType}
   */
  list = undefined;

  /**
   * Icon indicating state of connection to database server
   * @type {{state, tooltip}}
   */
  dbServerConnectionIcon = {
    /** @type {ConnectionState} */
    state: ConnectionState.disconnected,

    /** @type {string} */
    tooltip: undefined
  };

  /**
   * Button which switches current view mode
   * @type {{icon, tooltip}}
   */
  toggleModeButton = {
    /** @type {IconType} */
    icon: undefined,

    /** @type {string} */
    tooltip: undefined
  };

  /**
   * Tooltip of go root button
   * @type {string}
   */
  goRootButtonTooltip = undefined;

  /**
   * Search box for finding and focusing target ideas
   * @type {SearchBox}
   */
  ideaSearchBox = new SearchBox({
    lookup: new Lookup({placeholder: 'search ideas'})
  });

  /**
   * Color picker
   * @type {ColorPicker}
   */
  colorPicker = new ColorPicker();

  /**
   * Constructor
   * @param {Partial<Mindset>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
