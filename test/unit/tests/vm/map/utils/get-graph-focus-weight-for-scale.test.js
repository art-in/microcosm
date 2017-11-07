import {expect} from 'test/utils';

import getNodeScaleForWeight from 'vm/map/utils/get-node-scale-for-weight';
import getGraphFocusWeightForScale from
    'vm/map/utils/get-graph-focus-weight-for-scale';

describe('get-graph-focus-weight-for-scale', () => {

    it('should focus zero weight zone for low scale', () => {

        // simulate zooming out
        for (let viewportScale = 1; viewportScale > 0; viewportScale -= 0.1) {
            const result = getGraphFocusWeightForScale(viewportScale);
            expect(result).to.equal(0);
        }
    });

    it('should be balanced with node downscaling', () => {
        
        // simulate a lot of nodes with different root path weights,
        // and get scale of each one
        const nodes = [];
        for (let weight = 0; weight < 100000; weight++) {
            const scale = getNodeScaleForWeight(weight);
            nodes.push({weight, scale});
        }
        
        // simulate zooming in
        for (let viewportScale = 1; viewportScale < 100; viewportScale += 0.1) {

            // get target focus weight for current scale
            const focusWeight = getGraphFocusWeightForScale(viewportScale);

            // find a node which happend to be in the center
            // of focus zone (focused node)
            const node = nodes.find(n => n.weight === focusWeight);

            // calculate resulting scale of focused node
            const resultingScale = node.scale * viewportScale;

            // ensure that nodes focused at each zoom step
            // stay close to original size (~1)
            expect(resultingScale).to.be.closeTo(1, 0.1);
        }
    });

});