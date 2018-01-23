/* global module */
module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    // [same as for js]
    indentation: [4],
    'no-missing-end-of-source-newline': null,
    'max-line-length': 80,

    // allow new lines between style props for groupings
    'declaration-empty-line-before': null,

    // allow empty rules to be able to set 'root' css modules class (which
    // css rule can be empty) to root component element, so it can be found
    // later in debugger
    'block-no-empty': null,

    'selector-pseudo-class-no-unknown': [
      true,
      {
        // allow preudo-classes of css loader
        ignorePseudoClasses: ['global', 'export']
      }
    ],

    'no-eol-whitespace': [
      true,
      {
        // allow to indent empty lines
        ignore: ['empty-lines']
      }
    ]
  }
};
