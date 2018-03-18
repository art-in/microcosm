import md5 from 'js-md5';
import TurndownService from 'turndown';
import * as gfmPlugin from 'turndown-plugin-gfm';

import base64ToArrayBuffer from 'utils/base64-to-array-buffer';

var td = initTurndown();

/**
 * Converts Evernote Markup Language (ENML) 2.0 string to markdown string
 * https://dev.evernote.com/doc/articles/enml.php
 * http://xml.evernote.com/pub/enml2.dtd
 *
 * @param {string} enml
 * @param {Array.<EnexResource>} resources
 * @return {{markdown:string, warnings:Array.<string>}} markdown
 */
export default function enmlToMarkdown(enml, resources) {
  enml = addTableHeaders(enml);
  const res = addMediaResources(enml, resources);

  return {
    markdown: td.turndown(res.enml),
    warnings: res.warnings
  };
}

/**
 * Adds header rows to tables.
 *
 * Evernote does not create header rows, but GFM table requires header,
 * otherwise it will not be recognized.
 *
 * @param {string} enml
 * @return {string} enml
 */
function addTableHeaders(enml) {
  // <colgroup> is not necessary anyway, so we will mutate it to header.
  enml = enml.replace(/<colgroup>/g, '<thead><tr>');
  enml = enml.replace(/<\/colgroup>/g, '</tr></thead>');
  enml = enml.replace(/<col.*\/>/g, '<td>_</td>');

  return enml;
}

/**
 * Replaces ENML <en-media> references with actual resource data as inline HTML
 *
 * Currently only inlining images and ignoring everything else, as
 * 1. audio/video can be inserted into markdown as direct html tags only,
 *    which requires allowing all html tags in markdown-it - therefore requires
 *    external html sanitizing to avoid xss.
 * 2. how to handle other resource types (eg. pdf, doc, etc)?
 * 3. inlining big resource files into notes does not seems right. ideally it
 *    should be saved in some external attachments store.
 *
 * @param {string} enml
 * @param {Array.<EnexResource>} resources
 * @return {{enml:string, warnings:Array.<string>}}
 */
function addMediaResources(enml, resources) {
  const warnings = [];

  // map resource hashes to resource objects
  /** @type {Map<string, EnexResource>} */
  const resourceMap = new Map();

  if (resources && resources.length) {
    resources
      .filter(
        resource =>
          resource.data.encoding === 'base64' &&
          resource.mime.startsWith('image')
      )
      .forEach(resource => {
        const base64 = resource.data._;
        const binary = window.atob(base64);
        const buffer = base64ToArrayBuffer(binary);
        const hash = md5(buffer);
        resourceMap.set(hash, resource);
      });
  }

  // replace <en-media> tags with inline HTML
  const enMediaRegexp = /<en-media hash="(.*?)".*type="(.*?)".*\/>/g;
  enml = enml.replace(enMediaRegexp, (_, hash, type) => {
    if (!type.startsWith('image')) {
      warnings.push(`Ignoring resource of type '${type}'.`);
      return '';
    }
    const resource = resourceMap.get(hash);
    if (!resource) {
      throw Error(`Media resource with hash '${hash}' was not found`);
    }

    const base64 = resource.data._.replace(/\s/g, '');
    const dataUrl = `data:${resource.mime};base64,${base64}`;

    let alt = '';
    const {resourceAttributes} = resource;
    if (resourceAttributes && resourceAttributes.fileName) {
      alt = resourceAttributes.fileName;
    }

    return `<img src='${dataUrl}' alt='${alt}'>`;
  });

  return {enml, warnings};
}

/**
 * Inits turndown service.
 *
 * Turndown uses CommonMark spec by default, but we need to tune it a bit:
 * - add extensions from Github Flavored Markdown (GFM)
 * - better handle ENML specifics
 * - fix few issues of Turndown parser
 *
 * @return {TurndownService}
 */
function initTurndown() {
  const td = new TurndownService();

  td.addRule('div', {
    filter: ['div'],
    replacement: (content, node) => {
      // avoid extra new line after <div> in table cell, since it breaks GFM
      // table format
      if (node.parentNode.nodeName === 'TD') {
        return content;
      }

      // default
      return content + '  \n';
    }
  });

  td.addRule('br', {
    filter: ['br'],
    replacement: (content, node, options) => {
      const parent = node.parentNode;
      const parentChilds = node.parentNode.childNodes;
      // avoid extra new line after <div>, since <div> already has one.
      // checkbox content is erroneously parsed as parent of <en-todo>, but in
      // fact parent is <div>.
      if (
        (parent.nodeName === 'DIV' || parent.nodeName === 'EN-TODO') &&
        parentChilds[parentChilds.length - 1] === node
      ) {
        return '';
      }

      // default
      return options.br + '\n';
    }
  });

  // support tables (GFM)
  td.use([gfmPlugin.tables]);

  // support strikethrough (GFM)
  td.addRule('strikethrough', {
    filter: ['del', 's', 'strike'],
    // use double tildes instead of single tilde defined by GFM spec, since
    // markdown-it has issue parsing single tilde.
    // https://github.com/markdown-it/markdown-it/issues/446
    replacement: content => '~~' + content + '~~'
  });

  // support tasklists (GFM)
  td.addRule('tasklist_evernote', {
    filter: ['en-todo'],
    replacement: (content, node) => {
      const attr = node.attributes.getNamedItem('checked');
      const checkbox = attr && attr.value === 'true' ? '- [x] ' : '- [ ] ';
      return checkbox + content;
    }
  });

  return td;
}
