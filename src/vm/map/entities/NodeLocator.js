import initProps from 'utils/init-props';

import ViewModel from 'vm/utils/ViewModel';
import PointType from 'model/entities/Point';

/**
 * Highlights position of target node
 */
export default class NodeLocator extends ViewModel {
  /**
   * Position
   * @type {PointType}
   */
  pos;

  /**
   * Scale (so locator can downscale along with deep nodes)
   * @type {number}
   */
  scale;

  /**
   * Constructor
   * @param {Partial<NodeLocator>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
