import {expect} from 'test/utils';

import getNodeScaleForWeight from 'vm/map/utils/get-node-scale-for-weight';
import getMindmapFocusWeightForScale from 'vm/map/utils/get-mindmap-focus-weight-for-scale';

describe('get-mindmap-focus-weight-for-scale', () => {
  it('should focus zero weight zone for low scale', () => {
    // simulate zooming out
    for (let viewportScale = 1; viewportScale > 0; viewportScale -= 0.1) {
      const result = getMindmapFocusWeightForScale(viewportScale);
      expect(result).to.equal(0);
    }
  });

  it('should be balanced with node downscaling', () => {
    // simulate a lot of nodes with different root path weights,
    // and get scale of each one
    const nodes = [];
    for (let weight = 0; weight < 100000; weight += 100) {
      const scale = getNodeScaleForWeight(weight);
      nodes.push({weight, scale});
    }

    // simulate zooming in
    for (let viewportScale = 1; viewportScale < 100; viewportScale += 0.2) {
      // get target focus weight for current scale
      const focusWeight = getMindmapFocusWeightForScale(viewportScale);

      // find a node which happened to be in the center
      // of focus zone (focused node)
      const node = nodes.find(n => Math.abs(n.weight - focusWeight) < 1);

      if (node === undefined) {
        throw Error(
          `Node with appropriate RPW '${focusWeight}' ` +
            `for viewport scale '${viewportScale}' was not found`
        );
      }

      // calculate resulting scale of focused node
      const resultingScale = node.scale * viewportScale;

      // ensure that nodes focused at each zoom step
      // stay close to original size (~1)
      expect(resultingScale).to.be.closeTo(1, 0.1);
    }
  });
});
