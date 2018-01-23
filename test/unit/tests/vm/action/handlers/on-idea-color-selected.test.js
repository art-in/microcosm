import {expect} from 'test/utils';
import {spy} from 'sinon';

import handler from 'src/vm/action/handler';
const handle = handler.handle.bind(handler);

describe('on-idea-color-selected', () => {
  it('should dispatch set-idea-color', () => {
    // setup
    const dispatch = spy();

    // target
    handle(
      null,
      {
        type: 'on-idea-color-selected',
        data: {
          ideaId: 'idea',
          color: 'red'
        }
      },
      dispatch
    );

    // check
    expect(dispatch.callCount).to.equal(1);
    expect(dispatch.firstCall.args).to.have.length(1);
    const args = dispatch.firstCall.args[0];

    expect(args.type).to.equal('set-idea-color');
    expect(args.data.ideaId).to.equal('idea');
    expect(args.data.color).to.equal('red');
  });

  it('should hide color picker', () => {
    // setup
    const dispatch = spy();

    // target
    const patch = handle(
      null,
      {
        type: 'on-idea-color-selected',
        data: {
          ideaId: 'idea',
          color: 'red'
        }
      },
      dispatch
    );

    // check
    expect(patch).to.have.length(1);

    expect(patch['update-color-picker']).to.exist;
    expect(patch['update-color-picker'][0].data).to.deep.equal({
      active: false
    });
  });
});
