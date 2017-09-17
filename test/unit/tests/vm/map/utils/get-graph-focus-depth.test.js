import {expect} from 'chai';

import getGraphFocusDepth from 'src/vm/map/utils/get-graph-focus-depth';
import getNodeScaleForDepth from 'src/vm/map/utils/get-node-scale-for-depth';

describe('get-graph-focus-depth', () => {


    it('should return integer depth for fractional scale', () => {

        const result = getGraphFocusDepth(2.73);
        expect(result % 1).to.equal(0);
    });

    it('should focus zero depth for very low scale', () => {

        const result = getGraphFocusDepth(0);
        expect(result).to.equal(0);
    });

    it('should be balanced with node depth downscaling', () => {

        // gather node scales at range
        // of depth levels in deep
        const nodes = [];
        for (let depth = 0; depth < 100; depth++) {
            const scale = getNodeScaleForDepth(depth);
            nodes.push({depth, scale});
        }
        
        // check resulting node scales
        // at range of viewport scales (zoom in)
        for (let viewportScale = 0; viewportScale < 100; viewportScale += 0.2) {

            // target
            const focusDepth = getGraphFocusDepth(viewportScale);

            // get node at focus depth
            const node = nodes.find(n => n.depth === focusDepth);

            // calculate resulting scale of focused node
            const resultingScale = node.scale * viewportScale;

            if (node.depth === 0) {
                // do not check zero depth since
                // root node will stay focused 
                // at very low viewport scales,
                // and so can be infinitly downscaled
                continue;
            }
            
            // check that at each step of zooming,
            // nodes that get focused at each zoom level
            // stay close to original size
            expect(resultingScale).to.be.greaterThan(0.5);
            expect(resultingScale).to.be.lessThan(1.5);
        }
    });

});