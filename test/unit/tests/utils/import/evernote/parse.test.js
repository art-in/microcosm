import {expect} from 'test/utils';

import NoteType from 'src/utils/import/entities/Note';
import parseEvernote from 'src/utils/import/evernote/parse';

import cases from './cases';

describe('parse', () => {
  for (const caseName in cases) {
    it(caseName, async () => {
      const promise = parseEvernote(cases[caseName]);
      await checkResult(caseName, promise);
    });
  }
});

/**
 * @param {string} caseName
 * @param {Promise.<{notes:Array.<NoteType>, warnings:Array.<string>}>} promise
 */
async function checkResult(caseName, promise) {
  switch (caseName) {
    case 'basic-single-note': {
      const {notes, warnings} = await promise;
      expect(notes).to.have.length(1);
      expect(notes[0].title).to.equal('TEST TITLE');
      expect(notes[0].content).to.equal('TEST VALUE');
      expect(notes[0].created).to.be.a('date');
      expect(notes[0].created.toISOString()).to.equal(
        '2018-03-13T12:03:12.000Z'
      );
      expect(warnings).to.be.empty;
      break;
    }

    case 'basic-multiple-notes': {
      const {notes, warnings} = await promise;
      expect(warnings).to.be.empty;
      expect(notes).to.have.length(2);
      expect(notes[0].title).to.equal('TEST TITLE 1');
      expect(notes[0].content).to.equal('TEST VALUE 1');
      expect(notes[0].created).to.be.a('date');
      expect(notes[0].created.toISOString()).to.equal(
        '2018-03-13T12:03:12.000Z'
      );
      expect(notes[1].title).to.equal('TEST TITLE 2');
      expect(notes[1].content).to.equal('TEST VALUE 2');
      expect(notes[1].created).to.be.a('date');
      expect(notes[1].created.toISOString()).to.equal(
        '2018-03-13T13:04:01.000Z'
      );
      break;
    }

    case 'basic-no-content': {
      const {notes, warnings} = await promise;
      expect(warnings).to.be.empty;
      expect(notes).to.have.length(1);
      break;
    }

    case 'basic-no-created': {
      const {notes, warnings} = await promise;
      expect(warnings).to.be.empty;
      expect(notes).to.have.length(1);
      expect(notes[0].title).to.equal('TEST TITLE');
      expect(notes[0].content).to.equal('TEST VALUE');
      expect(notes[0].created).to.equal(null);
      break;
    }

    case 'formatting-simple': {
      const {notes, warnings} = await promise;
      expect(warnings).to.be.empty;
      expect(notes).to.have.length(1);
      expect(notes[0].content).to.equal(
        '**bold**  \n' +
        '_italic_  \n' +
        'underline  \n' + // ignored
          '~~strikethrough~~  \n' +
          'highlight' // ignored
      );
      break;
    }

    case 'formatting-bold-fragment': {
      const {notes, warnings} = await promise;
      expect(warnings).to.be.empty;
      expect(notes).to.have.length(1);
      expect(notes[0].content).to.equal(
        'normal test **bold text** normal text'
      );
      break;
    }

    case 'formatting-bold-paragraph': {
      const {notes, warnings} = await promise;
      expect(warnings).to.be.empty;
      expect(notes).to.have.length(1);
      expect(notes[0].content).to.equal(
        // ignored since <b> wrapper was replaced with inline styles
        'normal text  \n' +
        '  \n' +
        'bold text  \n' +
        'bold text  \n' +
        '  \n' +
        '  \n' + // extra new line, because <br> wrapped to <span>
          'normal text'
      );
      break;
    }

    case 'formatting-paragraphs': {
      const {notes, warnings} = await promise;
      expect(warnings).to.be.empty;
      expect(notes).to.have.length(1);
      expect(notes[0].content).to.equal(
        'first paragraph: first line  \n' +
          'first paragraph: second line  \n' +
          '  \n' +
          'second paragraph'
      );
      break;
    }

    case 'formatting-lists': {
      const {notes, warnings} = await promise;
      expect(warnings).to.be.empty;
      expect(notes).to.have.length(1);
      expect(notes[0].content).to.equal(
        '*   first bullet\n' +
          '*   second bullet\n\n' +
          '  \n  \n\n' +
          '1.  first number\n' +
          '2.  second number'
      );
      break;
    }

    case 'formatting-checkboxes': {
      const {notes, warnings} = await promise;
      expect(warnings).to.be.empty;
      expect(notes).to.have.length(1);
      expect(notes[0].content).to.equal(
        '- [ ] first checkbox (unchecked)  \n' +
          '- [ ] second checkbox (unchecked)  \n' +
          '- [x] third checkbox (checked)'
      );
      break;
    }

    case 'formatting-horizontal-rule': {
      const {notes, warnings} = await promise;
      expect(warnings).to.be.empty;
      expect(notes).to.have.length(1);
      expect(notes[0].content).to.equal(
        'line before rule  \n\n* * *\n\n  \nline after rule'
      );
      break;
    }

    case 'formatting-table': {
      const {notes, warnings} = await promise;
      expect(warnings).to.be.empty;
      expect(notes).to.have.length(1);
      expect(notes[0].content).to.equal(
        '| _ | _ |\n' +
          '| --- | --- |\n' +
          '| row-1-column-1 | row-1-column-2 |\n' +
          '| row-2-column-1 | row-2-column-2 |'
      );
      break;
    }

    case 'resources-image-gif': {
      const {notes, warnings} = await promise;
      expect(warnings).to.be.empty;
      expect(notes).to.have.length(1);
      expect(notes[0].content).to.match(
        /^!\[bus\.gif\]\(data:image\/gif;base64,.*\)$/
      );
      break;
    }

    case 'resources-images-jpg-bmp-png-gif-svg-tiff-webp': {
      const {notes, warnings} = await promise;
      const cases = [
        '![JPG.jpg](data:image/jpeg;base64',
        '![BMP.bmp](data:image/bmp;base64',
        '![PNG.png](data:image/png;base64',
        '![GIF.gif](data:image/gif;base64',
        '![SVG.svg](data:image/svg+xml;base64',
        '![TIFF.tif](data:image/tiff;base64'
      ];

      expect(notes).to.have.length(1);
      cases.forEach(c => expect(notes[0].content).to.contain(c));

      expect(warnings).to.have.length(1);
      expect(warnings).to.deep.equal([
        `While parsing note "IMAGES": ` +
          `Ignoring resource of type 'application/octet-stream'.` // webp
      ]);
      break;
    }

    case 'resources-audio-mp3': {
      const {notes, warnings} = await promise;
      expect(notes).to.have.length(1);
      expect(notes[0].content).to.be.empty;
      expect(warnings).to.have.length(1);
      expect(warnings[0]).to.equal(
        `While parsing note "AUDIO": Ignoring resource of type 'audio/mpeg'.`
      );
      break;
    }

    case 'resources-multiple': {
      const {notes, warnings} = await promise;
      expect(notes).to.have.length(1);
      expect(notes[0].content).to.contain('mp3 file:  \n\n  \n'); // ignored
      expect(notes[0].content).to.contain('js file:  \n\n  \n'); // ignored
      expect(notes[0].content).to.match(/pdf file:$/); // ignored
      expect(notes[0].content).to.contain(
        '![favicon.png](data:image/png;base64'
      );

      expect(warnings).to.have.length(3);

      const prefix = `While parsing note "MULTIPLE RESOURCES": `;
      expect(warnings).to.deep.equal([
        prefix + `Ignoring resource of type 'audio/mpeg'.`,
        prefix + `Ignoring resource of type 'text/plain'.`,
        prefix + `Ignoring resource of type 'application/pdf'.`
      ]);
      break;
    }

    case 'resources-attributes-not-exist': {
      const {notes, warnings} = await promise;
      expect(warnings).to.be.empty;
      expect(notes).to.have.length(1);
      expect(notes[0].content).to.match(/^!\[\]\(data:image\/gif;base64,.*\)$/);
      break;
    }

    case 'resources-attributes-empty': {
      const {notes, warnings} = await promise;
      expect(warnings).to.be.empty;
      expect(notes).to.have.length(1);
      expect(notes[0].content).to.match(/^!\[\]\(data:image\/gif;base64,.*\)$/);
      break;
    }

    case 'invalid-enex-empty': {
      await expect(promise).to.be.rejectedWith(`Received ENEX is empty`);
      break;
    }

    case 'invalid-enex-schema-note-title': {
      await expect(promise).to.be.rejectedWith(
        `ValidationError: child "enExport" fails because [child "note" ` +
          `fails because ["note" at position 0 fails because [child "title" ` +
          `fails because ["title" is required]]]]`
      );
      break;
    }

    case 'invalid-enex-schema-root-element': {
      await expect(promise).to.be.rejectedWith(
        `ValidationError: child "enExport" fails because ["enExport" is ` +
          `required]`
      );
      break;
    }

    case 'invalid-xml-malformed': {
      await expect(promise).to.be.rejectedWith('Unclosed root tag');
      break;
    }

    case 'invalid-xml': {
      await expect(promise).to.be.rejectedWith(
        'Non-whitespace before first tag'
      );
      break;
    }

    case 'invalid-resource-image-not-found': {
      await expect(promise).to.be.rejectedWith(
        `Media resource with hash '110c179554ba9760c943b63e9e9da8f0' was not ` +
          `found`
      );
      break;
    }

    case 'invalid-resource-base64': {
      await expect(promise).to.be.rejectedWith(
        `Failed to execute 'atob' on 'Window': The string to be decoded is ` +
          `not correctly encoded.`
      );
      break;
    }

    default:
      throw Error(`Unknown case '${caseName}'`);
  }
}
