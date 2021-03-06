import {expect, timer} from 'test/utils';
import {stub} from 'sinon';
import EventEmitter from 'events';

import Patch from 'src/utils/state/Patch';
import Action from 'src/utils/state/Action';

import logger from 'src/utils/state/middlewares/logger';

// console style tag
const S = '%c';

describe('logger', () => {
  /** @type {sinon.SinonStub} */
  let groupCollapsed;

  /** @type {sinon.SinonStub} */
  let log;

  /** @type {sinon.SinonStub} */
  let groupEnd;

  before(() => {
    groupCollapsed = stub(window.console, 'groupCollapsed');
    log = stub(window.console, 'log');
    groupEnd = stub(window.console, 'groupEnd');
  });

  after(() => {
    groupCollapsed.restore();
    log.restore();
    groupEnd.restore();
  });

  afterEach(() => {
    groupCollapsed.reset();
    log.reset();
    groupEnd.reset();
  });

  describe('successful action', () => {
    beforeEach(() => {
      // setup
      const dispatchEvents = new EventEmitter();

      const middleware = logger();

      const action = new Action({type: 'my-action', data: 'A'});
      const prevState = {model: 'prev model', vm: 'prev vm'};
      const patch = new Patch({type: 'my-mutation', data: 'M'});
      const nextState = {model: 'next model', vm: 'next vm'};

      middleware.onDispatch(dispatchEvents, action);

      dispatchEvents.emit('before-dispatch', {state: prevState, action});
      dispatchEvents.emit('before-handler', {state: prevState, action});
      dispatchEvents.emit('after-handler', {state: prevState});
      dispatchEvents.emit('before-mutation', {state: prevState, patch});
      dispatchEvents.emit('after-mutation', {state: nextState});
      dispatchEvents.emit('after-dispatch', {state: nextState});
    });

    it('should make collapsed group', () => {
      expect(groupCollapsed.callCount).to.equal(1);
      expect(log.callCount).to.equal(4);
      expect(groupEnd.callCount).to.equal(1);
    });

    it('should log action type', () => {
      expect(groupCollapsed.firstCall.args[0]).to.match(
        RegExp(`^${S}action ${S}my-action`)
      );
    });

    it('should log duration', () => {
      expect(groupCollapsed.firstCall.args[0]).to.match(
        RegExp(`${S}\\(\\d ms\\)`)
      );
    });

    it('should log prev state', () => {
      expect(log.getCall(0).args[0]).to.match(RegExp(`${S}prev state`));

      expect(log.getCall(0).args[2]).to.deep.equal({
        model: 'prev model',
        vm: 'prev vm'
      });
    });

    it('should log action (with handler duration)', () => {
      expect(log.getCall(1).args[0]).to.match(
        RegExp(`${S}action ${S}\\(\\d ms\\)`)
      );

      expect(log.getCall(1).args[3]).to.be.instanceOf(Action);
      expect(log.getCall(1).args[3]).to.containSubset({
        type: 'my-action',
        data: 'A'
      });
    });

    it('should log patch (with mutation duration)', () => {
      expect(log.getCall(2).args[0]).to.match(
        RegExp(`${S}patch ${S}\\(\\d ms\\)`)
      );

      expect(log.getCall(2).args[3]).to.containSubset({
        mutations: [
          {
            type: 'my-mutation',
            data: 'M'
          }
        ]
      });
    });

    it('should log next state', () => {
      expect(log.getCall(3).args[0]).to.match(RegExp(`${S}next state`));

      expect(log.getCall(3).args[2]).to.deep.equal({
        model: 'next model',
        vm: 'next vm'
      });
    });
  });

  describe('action failed in handler', () => {
    beforeEach(() => {
      // setup
      const dispatchEvents = new EventEmitter();

      const middleware = logger();

      const action = new Action({type: 'my-action', data: 'A'});
      const prevState = {model: 'prev model', vm: 'prev vm'};
      const error = new Error('boom');

      middleware.onDispatch(dispatchEvents, action);

      dispatchEvents.emit('before-dispatch', {state: prevState, action});
      dispatchEvents.emit('before-handler', {state: prevState, action});
      dispatchEvents.emit('handler-fail', {error});
    });

    it('should make collapsed group', () => {
      expect(groupCollapsed.callCount).to.equal(1);
      expect(log.callCount).to.equal(2);
      expect(groupEnd.callCount).to.equal(1);
    });

    it('should log action type', () => {
      expect(groupCollapsed.firstCall.args[0]).to.match(
        RegExp(`^${S}action ${S}my-action`)
      );
    });

    it('should log duration', () => {
      expect(groupCollapsed.firstCall.args[0]).to.match(
        RegExp(`${S}\\(\\d ms\\)`)
      );
    });

    it('should log fail source', () => {
      expect(groupCollapsed.firstCall.args[0]).to.match(
        RegExp(`${S} \\[failed in handler\\]`)
      );
    });

    it('should log prev state', () => {
      expect(log.getCall(0).args[0]).to.match(RegExp(`${S}prev state`));

      expect(log.getCall(0).args[2]).to.deep.equal({
        model: 'prev model',
        vm: 'prev vm'
      });
    });

    it('should log action (with handler duration)', () => {
      expect(log.getCall(1).args[0]).to.match(
        RegExp(`${S}action ${S}\\(\\d ms\\)`)
      );

      expect(log.getCall(1).args[3]).to.be.instanceOf(Action);
      expect(log.getCall(1).args[3]).to.containSubset({
        type: 'my-action',
        data: 'A'
      });
    });

    it('should NOT log patch', () => {
      expect(log.getCall(2)).to.not.exist;
    });

    it('should NOT log next state', () => {
      expect(log.getCall(3)).to.not.exist;
    });
  });

  describe('action failed in resulting mutation', () => {
    beforeEach(() => {
      // setup
      const dispatchEvents = new EventEmitter();

      const middleware = logger();

      const action = new Action({type: 'my-action', data: 'A'});
      const prevState = {model: 'prev model', vm: 'prev vm'};
      const patch = new Patch({type: 'my-mutation', data: 'M'});
      const error = new Error('boom');

      middleware.onDispatch(dispatchEvents, action);

      dispatchEvents.emit('before-dispatch', {state: prevState, action});
      dispatchEvents.emit('before-handler', {state: prevState, action});
      dispatchEvents.emit('after-handler', {state: prevState});
      dispatchEvents.emit('before-mutation', {state: prevState, patch});
      dispatchEvents.emit('mutation-fail', {error});
    });

    it('should make collapsed group', () => {
      expect(groupCollapsed.callCount).to.equal(1);
      expect(log.callCount).to.equal(3);
      expect(groupEnd.callCount).to.equal(1);
    });

    it('should log action type', () => {
      expect(groupCollapsed.firstCall.args[0]).to.match(
        RegExp(`^${S}action ${S}my-action`)
      );
    });

    it('should log duration', () => {
      expect(groupCollapsed.firstCall.args[0]).to.match(
        RegExp(`${S}\\(\\d ms\\)`)
      );
    });

    it('should log fail source', () => {
      expect(groupCollapsed.firstCall.args[0]).to.match(
        RegExp(`${S} \\[failed in mutator\\]`)
      );
    });

    it('should log prev state', () => {
      expect(log.getCall(0).args[0]).to.match(RegExp(`${S}prev state`));

      expect(log.getCall(0).args[2]).to.deep.equal({
        model: 'prev model',
        vm: 'prev vm'
      });
    });

    it('should log action (with handler duration)', () => {
      expect(log.getCall(1).args[0]).to.match(
        RegExp(`${S}action ${S}\\(\\d ms\\)`)
      );

      expect(log.getCall(1).args[3]).to.be.instanceOf(Action);
      expect(log.getCall(1).args[3]).to.containSubset({
        type: 'my-action',
        data: 'A'
      });
    });

    it('should log patch (with mutation duration)', () => {
      expect(log.getCall(2).args[0]).to.match(
        RegExp(`${S}patch ${S}\\(\\d ms\\)`)
      );

      expect(log.getCall(2).args[3]).to.containSubset({
        mutations: [
          {
            type: 'my-mutation',
            data: 'M'
          }
        ]
      });
    });

    it('should NOT log next state', () => {
      expect(log.getCall(3)).to.not.exist;
    });
  });

  describe('action failed on intermediate mutation', () => {
    beforeEach(() => {
      // setup
      const dispatchEvents = new EventEmitter();

      const middleware = logger();

      const action = new Action({type: 'my-action', data: 'A'});
      const prevState = {model: 'prev model', vm: 'prev vm'};
      const patch = new Patch({type: 'my-mutation', data: 'M'});
      const error = new Error('boom');

      middleware.onDispatch(dispatchEvents, action);

      dispatchEvents.emit('before-dispatch', {state: prevState, action});
      dispatchEvents.emit('before-handler', {state: prevState, action});
      dispatchEvents.emit('before-mutation', {state: prevState, patch});
      dispatchEvents.emit('mutation-fail', {error});
    });

    it('should make collapsed group', () => {
      expect(groupCollapsed.callCount).to.equal(1);
      expect(log.callCount).to.equal(3);
      expect(groupEnd.callCount).to.equal(1);
    });

    it('should log action type', () => {
      expect(groupCollapsed.firstCall.args[0]).to.match(
        RegExp(`^${S}action ${S}my-action`)
      );
    });

    it('should log duration', () => {
      expect(groupCollapsed.firstCall.args[0]).to.match(
        RegExp(`${S}\\(\\d ms\\)`)
      );
    });

    it('should log fail source', () => {
      expect(groupCollapsed.firstCall.args[0]).to.match(
        RegExp(`${S} \\[failed in mutator\\]`)
      );
    });

    it('should log prev state', () => {
      expect(log.getCall(0).args[0]).to.match(RegExp(`${S}prev state`));

      expect(log.getCall(0).args[2]).to.deep.equal({
        model: 'prev model',
        vm: 'prev vm'
      });
    });

    it('should log action (with handler duration)', () => {
      expect(log.getCall(1).args[0]).to.match(
        RegExp(`${S}action ${S}\\(\\d ms\\)`)
      );

      expect(log.getCall(1).args[3]).to.be.instanceOf(Action);
      expect(log.getCall(1).args[3]).to.containSubset({
        type: 'my-action',
        data: 'A'
      });
    });

    it('should log patch (with mutation duration)', () => {
      expect(log.getCall(2).args[0]).to.match(
        RegExp(`${S}patch ${S}\\(\\d ms\\)`)
      );

      expect(log.getCall(2).args[3]).to.containSubset({
        mutations: [
          {
            type: 'my-mutation',
            data: 'M'
          }
        ]
      });
    });

    it('should NOT log next state', () => {
      expect(log.getCall(3)).to.not.exist;
    });
  });

  describe('throttling', () => {
    it('should log unthrottled actions', () => {
      // setup
      const prevState = {model: 'prev model', vm: 'prev vm'};
      const nextState = {model: 'next model', vm: 'next vm'};

      const middleware = logger();

      const dispatch = action => {
        const events = new EventEmitter();
        middleware.onDispatch(events, action);

        events.emit('before-dispatch', {state: prevState, action});
        events.emit('before-handler', {state: prevState, action});
        events.emit('after-handler', {state: prevState});
        events.emit('after-dispatch', {state: nextState});
      };

      const throttledAction = new Action({
        type: 'throttled-action',
        throttleLog: true
      });

      const unthrottledAction = new Action({
        type: 'unthrottled-action'
      });

      // target
      dispatch(throttledAction);
      dispatch(throttledAction); // throttled

      dispatch(unthrottledAction);
      dispatch(unthrottledAction);

      // check
      expect(groupCollapsed.callCount).to.equal(3);
    });

    it('should NOT log throttled actions', () => {
      // setup
      const prevState = {model: 'prev model', vm: 'prev vm'};
      const nextState = {model: 'next model', vm: 'next vm'};

      const middleware = logger();

      const dispatch = action => {
        const events = new EventEmitter();
        middleware.onDispatch(events, action);

        events.emit('before-dispatch', {state: prevState, action});
        events.emit('before-handler', {state: prevState, action});
        events.emit('after-handler', {state: prevState});
        events.emit('after-dispatch', {state: nextState});
      };

      const action = new Action({
        type: 'action',
        throttleLog: true
      });

      // target
      dispatch(action);
      dispatch(action); // throttled

      // check
      expect(groupCollapsed.callCount).to.equal(1);
    });

    it('should resume log of throttled action after delay', async () => {
      // setup
      const prevState = {model: 'prev model', vm: 'prev vm'};
      const nextState = {model: 'next model', vm: 'next vm'};

      const middleware = logger();

      const dispatch = action => {
        const events = new EventEmitter();
        middleware.onDispatch(events, action);

        events.emit('before-dispatch', {state: prevState, action});
        events.emit('before-handler', {state: prevState, action});
        events.emit('after-handler', {state: prevState});
        events.emit('after-dispatch', {state: nextState});
      };

      const action = new Action({
        type: 'action',
        throttleLog: 50
      });

      // target
      dispatch(action);
      dispatch(action); // throttled

      await timer(50);

      dispatch(action);
      dispatch(action); // throttled

      expect(groupCollapsed.callCount).to.equal(2);
    });

    it('should NOT mix throttle state between action types', () => {
      // setup
      const prevState = {model: 'prev model', vm: 'prev vm'};
      const nextState = {model: 'next model', vm: 'next vm'};

      const middleware = logger();

      const dispatch = action => {
        const events = new EventEmitter();
        middleware.onDispatch(events, action);

        events.emit('before-dispatch', {state: prevState, action});
        events.emit('before-handler', {state: prevState, action});
        events.emit('after-handler', {state: prevState});
        events.emit('after-dispatch', {state: nextState});
      };

      const action1 = new Action({
        type: 'action 1',
        throttleLog: true
      });

      const action2 = new Action({
        type: 'action 2',
        throttleLog: true
      });

      // target
      dispatch(action1);
      dispatch(action2);

      // check
      expect(groupCollapsed.callCount).to.equal(2);
    });

    it('should NOT mix throttle state between instances', () => {
      // setup
      const prevState = {model: 'prev model', vm: 'prev vm'};
      const nextState = {model: 'next model', vm: 'next vm'};

      const middleware1 = logger();
      const middleware2 = logger();

      const dispatch1 = action => {
        const events = new EventEmitter();
        middleware1.onDispatch(events, action);

        events.emit('before-dispatch', {state: prevState, action});
        events.emit('before-handler', {state: prevState, action});
        events.emit('after-handler', {state: prevState});
        events.emit('after-dispatch', {state: nextState});
      };

      const dispatch2 = action => {
        const events = new EventEmitter();
        middleware2.onDispatch(events, action);

        events.emit('before-dispatch', {state: prevState, action});
        events.emit('before-handler', {state: prevState, action});
        events.emit('after-handler', {state: prevState});
        events.emit('after-dispatch', {state: nextState});
      };

      const action = new Action({
        type: 'action',
        throttleLog: true
      });

      // target
      dispatch1(action);
      dispatch2(action);

      // check
      expect(groupCollapsed.callCount).to.equal(2);
    });

    it('should log number of throttled action', async () => {
      // setup
      const prevState = {model: 'prev model', vm: 'prev vm'};
      const nextState = {model: 'next model', vm: 'next vm'};

      const middleware = logger();

      const dispatch = action => {
        const events = new EventEmitter();
        middleware.onDispatch(events, action);

        events.emit('before-dispatch', {state: prevState, action});
        events.emit('before-handler', {state: prevState, action});
        events.emit('after-handler', {state: prevState});
        events.emit('after-dispatch', {state: nextState});
      };

      const action = new Action({
        type: 'action',
        throttleLog: 50
      });

      // target
      dispatch(action);
      dispatch(action); // throttled
      dispatch(action); // throttled

      await timer(50);
      dispatch(action);

      await timer(50);
      dispatch(action);

      // check
      const logHeader1 = groupCollapsed.firstCall.args[0];
      const logHeader2 = groupCollapsed.secondCall.args[0];
      const logHeader3 = groupCollapsed.thirdCall.args[0];

      expect(logHeader1).to.not.contain(`throttled`);
      expect(logHeader2).to.contain(`[throttled: 2]`);
      expect(logHeader3).to.not.contain(`throttled`);
    });
  });

  describe('action with specific mutation targets', () => {
    it('should log targets', () => {
      // setup
      const dispatchEvents = new EventEmitter();

      const middleware = logger();

      const action = new Action({type: 'my-action'});
      const state = {};
      const patch = new Patch({
        type: 'my-mutation',
        targets: ['T'] // specific target
      });

      // target
      middleware.onDispatch(dispatchEvents, action);

      dispatchEvents.emit('before-dispatch', {state, action});
      dispatchEvents.emit('before-handler', {state, action});
      dispatchEvents.emit('after-handler', {state});
      dispatchEvents.emit('before-mutation', {state, patch});
      dispatchEvents.emit('after-mutation', {state});
      dispatchEvents.emit('after-dispatch', {state});

      // check
      const logHeader = groupCollapsed.firstCall.args[0];

      expect(logHeader).to.contain(`[targets: T]`);
    });

    it('should NOT log targets if no specific target', () => {
      // setup
      const dispatchEvents = new EventEmitter();

      const middleware = logger();

      const action = new Action({type: 'my-action'});
      const state = {};
      const patch = new Patch({type: 'my-mutation'}); // no specific tgt

      // target
      middleware.onDispatch(dispatchEvents, action);

      dispatchEvents.emit('before-dispatch', {state, action});
      dispatchEvents.emit('before-handler', {state, action});
      dispatchEvents.emit('after-handler', {state});
      dispatchEvents.emit('before-mutation', {state, patch});
      dispatchEvents.emit('after-mutation', {state});
      dispatchEvents.emit('after-dispatch', {state});

      // check
      const logHeader = groupCollapsed.firstCall.args[0];

      expect(logHeader).to.not.contain(`[targets:`);
    });
  });

  describe('action with child actions', () => {
    it('should log child actions', () => {
      // setup
      const events = new EventEmitter();

      const middleware = logger();

      const parentAction = new Action({type: 'parent-action'});
      const childAction1 = new Action({type: 'child-action-1'});
      const childAction2 = new Action({type: 'child-action-2'});

      const state = {};

      // target
      middleware.onDispatch(events, parentAction);

      events.emit('before-dispatch', {state, action: parentAction});
      events.emit('before-handler', {state, action: parentAction});

      events.emit('child-action', {action: childAction1});
      events.emit('child-action', {action: childAction2});

      events.emit('after-handler', {state});
      events.emit('after-dispatch', {state});

      // check
      const logHeader = groupCollapsed.firstCall.args[0];

      expect(logHeader).to.contain(`[child: child-action-1, child-action-2]`);
    });

    it('should NOT log child actions if no one were dispatched', () => {
      // setup
      const events = new EventEmitter();

      const middleware = logger();

      const action = new Action({type: 'parent-action'});

      const state = {};

      // target
      middleware.onDispatch(events, action);

      events.emit('before-dispatch', {state, action});
      events.emit('before-handler', {state, action});
      events.emit('after-handler', {state});
      events.emit('after-dispatch', {state});

      // check
      const logHeader = groupCollapsed.firstCall.args[0];

      expect(logHeader).to.not.contain(`[child:`);
    });
  });

  describe('mapping state for log', () => {
    beforeEach(() => {
      // setup
      const dispatchEvents = new EventEmitter();

      function mapState(state) {
        // take only part of state, ignore the rest
        const {vm: unrested, ...part} = state;
        return part;
      }

      const middleware = logger({mapState});

      const action = new Action({type: 'my-action', data: 'A'});
      const prevState = {model: 'prev model', vm: 'prev vm'};
      const patch = new Patch({type: 'my-mutation', data: 'M'});
      const nextState = {model: 'next model', vm: 'next vm'};

      middleware.onDispatch(dispatchEvents, action);

      dispatchEvents.emit('before-dispatch', {state: prevState, action});
      dispatchEvents.emit('before-handler', {state: prevState, action});
      dispatchEvents.emit('after-handler', {state: prevState});
      dispatchEvents.emit('before-mutation', {state: prevState, patch});
      dispatchEvents.emit('after-mutation', {state: nextState});
      dispatchEvents.emit('after-dispatch', {state: nextState});
    });

    it('should log prev state', () => {
      expect(log.getCall(0).args[0]).to.match(RegExp(`${S}prev state`));

      expect(log.getCall(0).args[2]).to.deep.equal({
        model: 'prev model'
      });
    });

    it('should log next state', () => {
      expect(log.getCall(3).args[0]).to.match(RegExp(`${S}next state`));

      expect(log.getCall(3).args[2]).to.deep.equal({
        model: 'next model'
      });
    });
  });
});
