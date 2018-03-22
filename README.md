# microcosm [![CircleCI Status](https://circleci.com/gh/artin-phares/microcosm.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/artin-phares/microcosm)

microcosm is a [note taking](https://en.wikipedia.org/wiki/Note-taking) web app, which represents notes as a [graph](https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)) of _ideas_ and _associations_.

# Features

- [x] [pwa](https://en.wikipedia.org/wiki/Progressive_web_app)
  - [x] responsive (phone, tablet, desktop)
  - [x] secure (https, cookie auth)
  - [x] offline ready (service worker, indexed db)
  - [x] installable
- [x] view modes:
  - [x] mindmap (map with pan & zoom)
  - [x] zen (simple textual form)
- [x] import from Evernote
 
# Install

```
git clone https://github.com/artin-phares/microcosm
cd microcosm
npm install
npm run build
npm run serve
```
 
# Config

There is [`config.js`](https://github.com/artin-phares/microcosm/blob/master/config.js) file with all the options and descriptions for them.
 
# Tasks

`npm run build` - make production build  
`npm run serve` - serve production build

`npm start` - make & serve dev build (watch mode)  

`npm run test` - run all tests  
`npm run test:static` - run static tests (lint, types, etc.)  
`npm run test:unit` - run unit tests  
`npm run test:unit:watch` - run unit tests (watch mode)
