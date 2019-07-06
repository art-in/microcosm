import MarkdownIt from 'markdown-it';
import TaskListsPlugin from 'markdown-it-task-lists';

import hl from './init-syntax-highlighter';
import classes from './Markdown.highlight.css';

// use CommonMark spec + few extensions from Github Flavored Markdown (GFM):
// - strikethrough (GFM). bug: requires two tildes instead of one.
//   https://github.com/markdown-it/markdown-it/issues/446
// - tables (GFM)
const md = new MarkdownIt({
  // enable autolinks (GFM)
  linkify: true,

  // highlight syntax in code blocks
  highlight: function(str, lang) {
    if (lang && hl.getLanguage(lang)) {
      return (
        `<pre class="${classes.root}"><code>` +
        hl.highlight(lang, str, true).value +
        '</code></pre>'
      );
    }
    return '<pre><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

// allow any image formats, to extend default support (bmp, svg+xml, tiff only).
// https://github.com/markdown-it/markdown-it/issues/447
const defaultValidate = md.validateLink;
md.validateLink = url => /^data:image\/.*?;/.test(url) || defaultValidate(url);

// add checkbox lists (GFM)
md.use(TaskListsPlugin, {
  // disable check boxes since checking them will not change source markdown
  // TODO: implement interactive checking
  enabled: false,
  label: false
});

// add target="_blank" attribute to all links
// https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
var defaultLinkRenderer =
  md.renderer.rules.link_open ||
  function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
  var aIndex = tokens[idx].attrIndex('target');

  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank']);
  } else {
    tokens[idx].attrs[aIndex][1] = '_blank';
  }

  return defaultLinkRenderer(tokens, idx, options, env, self);
};

export default md;
