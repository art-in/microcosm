Utils for connecting view components to store

---

Example (connect, Provider)
---

component:  

```javascript
/**
 * @typedef {object} Props
 * @prop {ViewModel} myVM - vm comes from parent component
 * @prop {function()} onClick - handlers mixed by connector
 * 
 * @extends {Component<Props>}
 */
class MyComponent extends Component {
     render() => (
         <div onClick={this.props.onClick}>
             this.props.myVM.someProp
         </div>
     )
}
```

connect:  

```javascript
const MyConnectedComponent = connect(

     // tell connector what view-model
     // to listen for 'change' events to update view
     props => props.myVM,

     // retransmit view events to store
     dispatch => ({
         onClick: () => dispatch({type: 'action'})

     }))(MyComponent);
```

render:  

```javascript
const vm = new ViewModel();

const store = new Store();
const dispatch = store.dispatch.bind(store);

ReactDom.render(
        <Provider dispatch={dispatch}>
            <MyConnectedComponent myVM={vm} />
        </Provider>,
        querySelector('#root'));
```
