1. Why they even added configuration?  
Whole point of `prettier` was to be 'opionated' linter and become common style standard in js community.  
And after half a year they added configuration (10 options at the moment)...  
https://github.com/prettier/prettier/issues/40

---

2. `printWidth` is not hard limit, but preferred line width
that can be extended in certain cases (eg. in long assignments, imports).  
on long assignments: https://github.com/prettier/prettier/issues/1966  
on long imports: https://github.com/prettier/prettier/issues/1954  

        You don't get much more information when they are in two lines and they look worse with a series of imports. This was done due to common request from people using prettier.

---

3. `printWidth` is not respected in comments.  
**Workaround**: enforce line limit in comments by eslint rule `max-len` with `comments` option.

---

4. `singleQuote` is not respected in JSX. 
 
        Quotes in JSX will always be double and ignore this setting.