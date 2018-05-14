import {expect} from 'test/utils';
import {spy} from 'sinon';
import {mount} from 'enzyme';

import ViewModel from 'src/vm/utils/ViewModel';
import React, {Component} from 'react';

import connect from 'view/utils/connect';
import StoreContext from 'view/utils/connect/context';

// TODO: unskip when enzyme supports new react v16 context api
//       https://github.com/airbnb/enzyme/issues/1509
describe.skip('connect', () => {
  it(`should update view on view-model 'change' events`, () => {
    // setup view-model
    class VM extends ViewModel {
      static eventTypes = ['change'];
      someProp = 'INITIAL';
    }

    const vm = new VM();

    // setup view

    /**
     * @typedef {object} Props
     * @prop {VM} myVM
     *
     * @extends {Component<Props>}
     */
    class View extends Component {
      render() {
        return <span>{this.props.myVM.someProp}</span>;
      }
    }

    // setup connected view
    const ConnectedView = connect(props => props.myVM)(View);

    // setup store dispatch
    const dispatch = spy();

    // target
    const wrapper = mount(
      <StoreContext.Provider value={dispatch}>
        <ConnectedView myVM={vm} />
      </StoreContext.Provider>
    );

    // check
    expect(wrapper).to.exist;

    vm.someProp = 'UPDATED';
    vm.emitChange();

    expect(wrapper.text()).to.equal('UPDATED');
  });

  it('should dispatch store actions on view events', () => {
    // setup view-model
    class VM extends ViewModel {
      static eventTypes = ['change'];
      someProp = 'vm prop value';
    }

    const vm = new VM();

    // setup view

    /**
     * @typedef {object} Props
     * @prop {VM} myVM
     * @prop {function(string)} onClick
     *
     * @extends {Component<Props>}
     */
    class View extends Component {
      onClick() {
        this.props.onClick('view event data');
      }
      render() {
        return <span onClick={this.onClick.bind(this)} />;
      }
    }

    // setup connected view
    const ConnectedView = connect(
      props => props.myVM,
      (dispatch, props) => ({
        onClick: eventData =>
          dispatch({
            type: 'action',
            data: `${eventData}: ${props.myVM.someProp}`
          })
      })
    )(View);

    // setup store dispatch
    const dispatch = spy();

    // target
    const wrapper = mount(
      <StoreContext.Provider value={dispatch}>
        <ConnectedView myVM={vm} />
      </StoreContext.Provider>
    );

    // check
    expect(wrapper).to.exist;

    wrapper.simulate('click');

    expect(dispatch.callCount).to.equal(1);
    expect(dispatch.firstCall.args).to.have.length(1);
    expect(dispatch.firstCall.args[0]).to.deep.equal({
      type: 'action',
      data: 'view event data: vm prop value'
    });
  });
});
