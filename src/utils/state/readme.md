Utils to work with application state.  

---

**Store** is container for state.  

State wrapped in store cannot be changed directly, but only through patches produced by action handlers.

**Patch** is group of mutations.  
**Handler** is group of registered action handlers that produce patches.  

action handler defines _what_ should be changed in state.    
mutator defines _how_ state should be changed.

---

--(action)--> {{ store **[action handler]** --(patch, old state)--> **[mutator]** }} --(new state)-->

---

Why not [`Redux`](https://redux.js.org/)?
---

In short:
- `Redux` enforces FP paradigm of "pure functions" too much by not allowing async reducers.
- (as a result) app logic gets inconsistently split between action creators and reducers.
- (as a result) action lifetime is too short - state mutation only (in reducers).  
therefore action creators part of work is not logged, nor it can be tested consistently with the rest of app logic from reducers.

`Redux` enforces its mutators (reducers) to be pure - therefore to be sync.  
By FP paradigm, having major amount of app logic defined in pure functions allows codebase to be more maintainable (readable, testable, etc.)

But. When you start using `Redux` in real project, you notice you cannot define your business logic fully inside reducers.  
Those unpure cases should be moved outside `Redux` - to external functions - action creators (eg. through `redux-thunk`).

Eg. async requests to server API.  
Some API requests may be conditional - subsequent requests depend on results from previous ones, etc.  
That conditioning is important part of business logic, and ideally should be unit tested.

In the end your business logic gets split between two places - action creators (AC) and store reducers (SR).  
You may even wonder [how to put entire business logic consistently in one place (AC or SR)](https://stackoverflow.com/questions/36437718/locate-business-logic-in-one-place-with-redux)? And ["There's no single clear [official] answer"](https://redux.js.org/faq/code-structure#how-should-i-split-my-logic-between-reducers-and-action-creators-where-should-my-%22business-logic%22-go) for that.  
Since you cannot make async work in SR, you may result having business logic consistently defined in AC and use SR only to mutate state (fat AC - thin SR).  
But this approach totally degrades original purpose of having major part of app logic in pure functions.  

Why `Redux` reducers should always be sync?  
What practical advantages of it, except strict following FP theory and simplification of `Redux` lib itself?

(Side note 1) Testing unpure async logic will need [some kind of side-effects mocking](https://github.com/reactjs/redux/blob/master/docs/recipes/WritingTests.md#async-action-creators) anyway.  
(Side note 2) Original `Flux` architecture does not have sync-only restriction for stores.  

How custom `Store` is different?

Action lifetime expanded: action is logged and counted with performance metrics starting from UI event to state mutation.

How custom `Store` is similar?

There is a split on Action Handlers and Mutators, corresponding to `Redux` "fat AC - thin SR" approach.  
Entire business logic consistently defined inside Action Handlers.  

(Side note 3) We need that split because our state has layered structure, and one Patch can be applied to several state layers.  

Store  | Redux | -
---    | ---   | ---
Action | (out of scope)         | event from UI component
Action Handler | Action Creator | business logic
Patch | Action                  | state mutation data
Mutator | Reducer               | state mutator

