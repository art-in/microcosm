1. ECMAScript uses simplified version of ISO 8601 date format.  
    Therefore valid ISO date `20180313T120312Z` parsed as `Invalid Date` with `Date.parse()` in Chrome 64.  

    https://www.ecma-international.org/ecma-262/6.0/#sec-date-time-string-format

    **Workaround**: parse with `momentjs`.
