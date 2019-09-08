import initProps from 'utils/init-props';

import ViewModel from 'vm/utils/ViewModel';
import PointType from 'model/entities/Point';

/**
 * Popup
 */
export default class Popup extends ViewModel {
  /**
   * Is shown?
   * @type {boolean}
   */
  active = false;

  /**
   * Position on viewport (browser or svg, depending on view render context)
   * @type {PointType|undefined}
   */
  pos;

  /**
   * Scale.
   * @type {number|undefined}
   */
  scale;

  /**
   * Constructor
   * @param {Partial<Popup>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
