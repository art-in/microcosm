> History log of bugs / unsupported-features / surprising-but-valid-behavior and other difficulties faced while using `typescript` for static type checking in this project.  

---

1. **jsdoc**: Desctructured function params are not supported  
    `TS8024: JSDoc '@param' tag has name 'opts', but there is no parameter with that name.`  
    https://github.com/Microsoft/TypeScript/issues/11859  

    _Workaround_: desctuct params in the body of function instead of params header.

---

2. **jsdoc**: Requires to import classes only for type declarations, which violates eslint `no-used-vars`.  
	feature request to not violate eslint rule: https://github.com/eslint/eslint/issues/2813  
	feature request to import/export types through jsdoc: https://github.com/Microsoft/TypeScript/issues/14377  

	_Workaround_: silent eslint for vars with 'Type' postfix (`no-used-vars` option `"varsIgnorePattern": ".+Type$"`)

---

3. **jsdoc**: `@interface` and `@implements` are not supported  
    https://github.com/Microsoft/TypeScript/issues/16142  

    _Workaround 1_: it is still possible to use interface classes as prop types in functions  
    (since `typescript` compares object types by props set (not by type names)).  
    _Workaround 2_: use typescript type definitions (`.d.ts`)
	
---

4. **typescript**: `export default from` is not supported  
    https://github.com/Microsoft/TypeScript/issues/4813  

    _Workaround 1_: `@ts-ignore` (prevents resolving type on import side)  
	_Workaround 2_: replace with supported form: `import module from '...'; export default module`;  

---

5. **typescript**: `Object is possibly 'undefined'` errors in `strictNullChecks` mode.  
    Generates a lot of unnecessary errors in `strictNullCheck` mode and blocks its usage.  
	https://github.com/Microsoft/TypeScript/issues/13369  

---

6. **jsdoc**: `@param {object}` resolved to type `any` instead of non-primitive as in `typescript`  
   https://github.com/Microsoft/TypeScript/issues/20337  

   _Workaround_: `@param {Object.<string, *>}`  

---

7. **jsdoc**: generic types are hard or impossible to define in `jsdoc` in complex cases,  
   like functions which are not called directly, but through another function which loose type info  
   (eg. `eventEmitter.emit('event type', param1)` calls event handler but we do not check `param1`)  
   to type check `Store#dispatch` calls: https://github.com/artin-phares/microcosm/issues/65

   _Workaround_: use typescript type definitions (`.d.ts`) (as already did for `connect`).   
  
---

8. **typescript(?)**: complex case of defining generic type for `connect`.  
   while connecting view components to state, own-props is not type-checked.  
   not sure if it is limitation of `typescript` or just bad type definitions.  
   https://github.com/artin-phares/microcosm/issues/66  
   
---

9. **jsdoc**: function overloading is not supported.
    https://github.com/Microsoft/TypeScript/issues/407
