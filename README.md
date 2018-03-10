# microcosm [![CircleCI Status](https://circleci.com/gh/artin-phares/microcosm.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/artin-phares/microcosm)

microcosm is a notebook web app, which represents notes as a graph of _ideas_ and _associations_.

# Features
 
 - [x] view modes:
   - mindmap (map with pan & zoom)
   - zen (simple textual form)
 - [x] [pwa](https://en.wikipedia.org/wiki/Progressive_web_app)
   - responsive (phone, tablet, desktop)
   - secure (https, cookie auth)
   - offline ready (service worker, indexed db)
   - installable
 - [ ] import from Evernote
 
 # Install
 
 ```
 git clone https://github.com/artin-phares/microcosm
 cd microcosm
 npm install
 npm run build
 npm run serve
 ```
 
 # Tasks
 
 `npm run build` - make production build  
 `npm run serve` - serve production build
 
 `npm start` - make & serve dev build (watch mode)  
 
 `npm run test` - run all tests  
 `npm run test:static` - run static tests (lint, types, etc.)  
 `npm run test:unit` - run unit tests  
 `npm run test:unit:watch` - run unit tests (watch mode)
 
 
 # Config
 
 There is [`config.js`](https://github.com/artin-phares/microcosm/blob/master/config.js) file with all the options and descriptions for them.
 
 