/* global module */
module.exports = {
  extends: 'stylelint-config-standard',
  /* TODO: ignore non-css files until embedded css is fixed
    https://github.com/stylelint/stylelint/issues/3219 */
  ignoreFiles: ['./**/*.html', './**/*.md', './**/*.enex'],
  rules: {
    // [same as for js]
    indentation: [2],
    'max-line-length': 80,
    'string-quotes': 'single',

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
    ],

    'unit-blacklist': [
      ['px', 'em', 'rem'],
      {
        ignoreProperties: {
          // px - for borders
          px: [
            'border',
            'border-top',
            'border-right',
            'border-bottom',
            'border-left',
            'outline',
            'stroke-width'
          ],
          // em - for everything that should depend on element local font size
          em: [
            '/^padding/',
            '/^margin/',
            'line-height',
            'border-radius',
            'box-shadow',
            'text-shadow'
          ],
          // rem - for everything else
          rem: [
            'font-size',
            'top',
            'right',
            'bottom',
            'left',
            '/^(max-|min-)?width/',
            '/^(max-|min-)?height/',
            'background-size',
            'background-position'
          ]
        },
        ignoreMediaFeatureNames: {
          px: ['/^(max-|min-)?width/']
        }
      }
    ]
  }
};
