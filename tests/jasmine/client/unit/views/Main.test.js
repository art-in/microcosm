importing([
      'models/Mindmap',
      'client/views/Main',
      'client/viewmodels/Mindmap',
      'client/viewmodels/Main'],
    (Mindmap, MainView, MindmapVM, MainVM) => {
      'use strict';

      describe('Main view', () => {

        it('should render main element', () => {
          let mainVM = new MainVM;
          mainVM.mindmap = new MindmapVM(new Mindmap);

          let box = document.createElement('div');
          React.render(React.createElement(MainView, mainVM), box);

          let main  = box.querySelector('main');

          expect(main).toBeTruthy();
        });

      });

    });
