Utils for connecting view components to store

---

Example (connect, Provider)
---

component:  

```javascript
class MyComponent extends Component {

     static propTypes = {

         // vm comes from parent component
         myVM: PropTypes.object,

         // handlers mixed by connector
         onClick: PropTypes.func
     };
     
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
