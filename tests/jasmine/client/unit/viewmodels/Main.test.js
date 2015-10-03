importing('client/viewmodels/Main',
    (MainVM) => {
      'use strict';

      describe('Main viewmodel', function() {
        let mainVM;

        beforeEach(() => {
          mainVM = new MainVM();
        });

        it('should load mindmap', (done) => {
          Tracker.autorun(() => {
            if (mainVM.load()) {
              expect(mainVM.mindmap).toBeTruthy();
              done();
            }
          });
        });

      });

    });