/* eslint-disable no-undef */

import hl from 'highlight.js/lib/highlight';

// directly import languages to avoid bundling unused modules
hl.registerLanguage('cpp', require('highlight.js/lib/languages/cpp'));
hl.registerLanguage('cs', require('highlight.js/lib/languages/cs'));
hl.registerLanguage('css', require('highlight.js/lib/languages/css'));
hl.registerLanguage('go', require('highlight.js/lib/languages/go'));
hl.registerLanguage('http', require('highlight.js/lib/languages/http'));
hl.registerLanguage('java', require('highlight.js/lib/languages/java'));
hl.registerLanguage('js', require('highlight.js/lib/languages/javascript'));
hl.registerLanguage('json', require('highlight.js/lib/languages/json'));
hl.registerLanguage('sql', require('highlight.js/lib/languages/sql'));
hl.registerLanguage('ts', require('highlight.js/lib/languages/typescript'));
hl.registerLanguage('xml', require('highlight.js/lib/languages/xml'));

export default hl;
