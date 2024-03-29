# microcosm ![GitHub Actions](https://github.com/art-in/microcosm/actions/workflows/test.yml/badge.svg)

microcosm is a [note taking](https://en.wikipedia.org/wiki/Note-taking) web app, which organizes notes in a [graph](https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)).

use case is [personal knowledge base](https://en.wikipedia.org/wiki/Personal_knowledge_base) for crystallizing ideas and saving important stuff.

[Demo (rus)](https://artin.space/microcosm/?user=demo&pass=demo)

# Features

- [x] [pwa](https://en.wikipedia.org/wiki/Progressive_web_app)
  - [x] responsive (phone, tablet, desktop)
  - [x] secure
  - [x] offline ready
  - [x] installable
- [x] view modes:
  - [x] mindmap
  - [x] zen (simple text)
- [x] markdown
- [x] import from Evernote
 
# Install

```
git clone https://github.com/art-in/microcosm
cd microcosm
npm install
npm run build
npm run serve
```
 
# Config

There is [`config.js`](https://github.com/art-in/microcosm/blob/master/config.js) file with all the options and descriptions for them.
 
# Tasks

<!-- use raw html as github flavored markdown does not support header-less tables -->
<table>
  <tr><td>npm start</td>  <td>make & serve dev build (watch mode)</td></tr>
  <tr><td>npm run build</td>  <td>make production build  </td></tr>
  <tr><td>npm run serve</td>  <td>serve production build</td></tr>
  <tr><td>npm run test</td>  <td>run all tests  </td></tr>
  <tr><td>npm run test:static</td>  <td>run static tests (lint, types, etc.)  </td></tr>
  <tr><td>npm run test:unit</td>  <td>run unit tests  </td></tr>
  <tr><td>npm run test:unit:watch</td>  <td>run unit tests (watch mode)</td></tr>
  <tr><td>npm run deploy:docker</td>  <td>publish docker image with production build to Docker Hub</td></tr>
</table>

