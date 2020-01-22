const INDENT_SIZE = 2;
const INDENT = ' '.repeat(INDENT_SIZE);

const SPACES = [
  ' ', // normal space
  '\t', // tab
  '\xa0', // non-breaking space (&nbsp)
  '\xad' // soft hyphen (&shy)
];

/**
 * Inserts or removes indent to/from selected fragment of text.
 *
 * Indent is a string of several space chars.
 * Newlines assumed to be single '\n' (LF) chars.
 *
 * TODO: replace this with native browser solution when available.
 * only currently available native solution is `.execCommand('indent', ...)`,
 * which does not work correctly (`blockquote`, `contenteditable`, no-sel case).
 * instead trying to manually re-implement rich editor behavior (eg. vs code).
 *
 * NB: chrome/ff clear undo/redo buffer after changing `.value`
 * https://bugs.chromium.org/p/chromium/issues/detail?id=1020840
 *
 * @param {object} opts
 * @param {string} opts.text
 * @param {number} opts.selStart
 * @param {number} opts.selEnd
 * @param {boolean} [opts.isInsert=true] - inserting or removing indent
 * @return {{text, selStart, selEnd}} updated text and selection
 */
export default function indent(opts) {
  let {text, selStart, selEnd} = opts;
  const {isInsert = true} = opts;

  if (isInRange(selStart, selEnd, 0, text.length)) {
    throw Error(`Invalid selection range: ${selStart} - ${selEnd}`);
  }

  if (isInsert) {
    // no selection: insert indent to exact position
    if (selStart === selEnd) {
      text = text.slice(0, selStart) + INDENT + text.slice(selEnd);
      selStart = selEnd = selStart + INDENT_SIZE;
    } else {
      // selection inside single line: replace selected chars with indent
      if (!text.slice(selStart, selEnd).includes('\n')) {
        text = text.slice(0, selStart) + INDENT + text.slice(selEnd);
        selStart = selEnd = selStart + INDENT_SIZE;
      }
      // selection over several lines: insert indent to beginning of each line
      else {
        // find first newline before selection
        let cur = selStart - 1;
        while (cur >= 0 && text[cur] !== '\n') {
          cur--;
        }

        // insert indents
        while (cur < text.length && cur < selEnd - 1) {
          if (cur === -1 || text[cur] === '\n') {
            text = text.slice(0, cur + 1) + INDENT + text.slice(cur + 1);
            if (cur + 1 < selStart) {
              selStart += INDENT_SIZE;
            }
            selEnd += INDENT_SIZE;
            cur += INDENT_SIZE;
          }

          cur++;
        }
      }
    }
  }

  // remove indent
  else {
    // find first newline before selection
    let cur = selStart - 1;
    while (cur >= 0 && text[cur] !== '\n') {
      cur--;
    }

    // remove indents
    while (cur < text.length && cur < selEnd) {
      if (cur === -1 || text[cur] === '\n') {
        // remove spaces from beginning of each line, but not more than indent
        let spacesCount = 0;
        let spacesEnd = cur + 1;
        while (
          SPACES.includes(text[spacesEnd]) &&
          spacesCount < INDENT_SIZE &&
          spacesEnd < text.length &&
          spacesEnd < selEnd
        ) {
          spacesCount++;
          spacesEnd++;
        }

        text = text.slice(0, cur + 1) + text.slice(cur + 1 + spacesCount);

        if (cur + 1 < selStart) {
          selStart -= spacesCount;
        }

        selEnd -= spacesCount;
      }

      cur++;
    }
  }

  return {text, selStart, selEnd};
}

/**
 * Checks if range A lays fully inside range B
 *
 * @param {number} startA
 * @param {number} endA
 * @param {number} startB
 * @param {number} endB
 * @return {boolean}
 */
function isInRange(startA, endA, startB, endB) {
  return (
    !Number.isInteger(startA) ||
    !Number.isInteger(endA) ||
    !Number.isInteger(startB) ||
    !Number.isInteger(endB) ||
    startA > endA ||
    startB > endB ||
    startA < startB ||
    startA > endB ||
    endA < startB ||
    endA > endB
  );
}
