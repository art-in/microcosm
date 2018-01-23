import {spy, stub} from 'sinon';
import {expect} from 'test/utils';

import SmartEventEmitter from 'src/utils/SmartEventEmitter';

describe('SmartEventEmitter', () => {
  describe('.emit()', () => {
    it('should execute event handlers', () => {
      // setup
      class TestEmitter extends SmartEventEmitter {}

      const emitter = new TestEmitter();

      const handler = spy();
      emitter.on('test-event', handler);

      // target
      emitter.emit('test-event');

      // check
      expect(handler.callCount).to.equal(1);
    });

    it('should warn if no handler was found', () => {
      // setup
      const consoleWarn = stub(console, 'warn');

      // setup
      class TestEmitter extends SmartEventEmitter {}
      const emitter = new TestEmitter();

      // target
      emitter.emit('test-event');

      // check
      expect(consoleWarn.callCount).to.equal(1);
      expect(consoleWarn.firstCall.args[0]).to.equal(
        `Triggering 'test-event' event on 'TestEmitter', ` +
          `but no one listens to it`
      );

      // teardown
      consoleWarn.restore();
    });
  });

  describe('.on()', () => {
    it('should fail on duplicate handlers', () => {
      // setup
      class TestEmitter extends SmartEventEmitter {}
      const emitter = new TestEmitter();

      emitter.on('test-event', () => {});

      // target
      const target = () => emitter.on('test-event', () => {});

      // check
      expect(target).to.throw(
        `'TestEmitter' already has handler for ` + `'test-event' event`
      );
    });
  });
});
