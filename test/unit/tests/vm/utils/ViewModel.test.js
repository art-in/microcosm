import {spy, stub} from 'sinon';
import {expect} from 'test/utils';

import ViewModel from 'src/vm/utils/ViewModel';

describe('ViewModel', () => {
  describe('.emitChange()', () => {
    it('should execute event handlers', () => {
      // setup
      class TestVM extends ViewModel {}

      const vm = new TestVM();

      const handler = spy();
      vm.subscribe(handler);

      // target
      vm.emitChange(1, 2, 3);

      // check
      expect(handler.callCount).to.equal(1);
      expect(handler.firstCall.args).to.have.length(3);
      expect(handler.firstCall.args).to.deep.equal([1, 2, 3]);
    });

    it('should warn if no handler was found', () => {
      // setup
      const consoleWarn = stub(window.console, 'warn');

      // setup
      class TestVM extends ViewModel {}
      const vm = new TestVM();

      // target
      vm.emitChange();

      // check
      expect(consoleWarn.callCount).to.equal(1);
      expect(consoleWarn.firstCall.args[0]).to.equal(
        `Triggering change event on 'TestVM' view model, ` +
          `but no one listens to it`
      );

      // teardown
      consoleWarn.restore();
    });
  });

  describe('.subscribe()', () => {
    it('should fail on duplicate change subscriptions', () => {
      // setup
      class TestVM extends ViewModel {}
      const vm = new TestVM();

      vm.subscribe(() => {});

      // target
      const target = () => vm.subscribe(() => {});

      // check
      expect(target).to.throw(
        `'TestVM' view model already has handler for ` + `change event`
      );
    });
  });

  describe('.unsubscribe()', () => {
    it('should remove handler subscription', () => {
      // setup
      const consoleWarn = stub(window.console, 'warn');

      class TestVM extends ViewModel {}

      const vm = new TestVM();

      const handler = spy();
      vm.subscribe(handler);

      // target
      vm.unsubscribe(handler);

      // check
      vm.emitChange();

      expect(handler.callCount).to.equal(0);

      // teardown
      consoleWarn.restore();
    });
  });
});
