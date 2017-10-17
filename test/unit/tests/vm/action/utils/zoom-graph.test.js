import {expect} from 'test/utils';

import zoomGraph from 'vm/action/utils/zoom-graph';

describe('zoom-graph', () => {

    describe('move viewbox towards zoom point', () => {

        it('should make full move if zoom point on corner', () => {
            
            // setup / target
            // _________________
            // |vb1             |
            // |                |
            // |        ________|
            // |       |vb2     |
            // |       |        |
            // |_______|_______x|
            //
            const viewbox = zoomGraph({
                viewbox: {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100,
                    scale: 1,
                    scaleMin: 0.2,
                    scaleMax: Infinity
                },
                viewport: {
                    width: 100,
                    height: 100
                },
                scale: 2,
                pos: {x: 100, y: 100}
            });

            // check
            expect(viewbox).to.containSubset({
                scale: 2,
                x: 50,
                y: 50,
                width: 50,
                height: 50
            });
        });

        it('should make partial move if zoom point on the side', () => {
            
            // setup / target
            //  ________________
            // |vb1  __________ |
            // |    |vb2       ||
            // |    |      x   ||
            // |    |          ||
            // |    |__________||
            // |________________|
            //
            const viewbox = zoomGraph({
                viewbox: {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100,
                    scale: 1,
                    scaleMin: 0.2,
                    scaleMax: Infinity
                },
                viewport: {
                    width: 100,
                    height: 100
                },
                scale: 2,
                pos: {x: 75, y: 50}
            });

            // check
            expect(viewbox).to.containSubset({
                scale: 2,
                x: 37.5,
                y: 25,
                width: 50,
                height: 50
            });
        });

        it('should make no move if zoom point in center', () => {
            
            // setup / target
            //  ________________
            // |vb1__________   |
            // |  |vb2       |  |
            // |  |    x     |  |
            // |  |          |  |
            // |  |__________|  |
            // |________________|
            //
            const viewbox = zoomGraph({
                viewbox: {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100,
                    scale: 1,
                    scaleMin: 0.2,
                    scaleMax: Infinity
                },
                viewport: {
                    width: 100,
                    height: 100
                },
                scale: 2,
                pos: {x: 50, y: 50}
            });

            // check
            expect(viewbox).to.containSubset({
                scale: 2,
                x: 25,
                y: 25,
                width: 50,
                height: 50
            });
        });
        
    });

    it('should fail if viewbox width is zero', () => {
        
        const result = () => zoomGraph({
            viewbox: {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                scale: 1,
                scaleMin: 0.2,
                scaleMax: Infinity
            },
            viewport: {
                width: 100,
                height: 100
            },
            scale: 1,
            pos: {x: 0, y: 0}
        });

        // check
        expect(result).to.throw(`Invalid viewbox width '0'`);
    });

});