importing(['models/Mindmap', 'client/viewmodels/Mindmap'],
    (Mindmap, MindmapVM) => {
      'use strict';

      describe('Mindmap viewmodel', () => {

        let mindmap;

        beforeEach(() => {
          mindmap = new Mindmap();
        });

        it('should produce graph', () => {
          let mindmapVM = new MindmapVM(mindmap);
          expect(mindmapVM.graph).toBeTruthy();
        });

      });

    });
