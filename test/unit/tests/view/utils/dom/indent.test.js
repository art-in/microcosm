import {expect} from 'test/utils';

import indent from 'src/view/utils/dom/indent';

const NBSP = '\xa0'; // non-breaking space

describe('indent', () => {
  describe('invalid selection', () => {
    it('should fail if selection range is undefined', () => {
      const text = 'hello';
      const selStart = undefined;
      const selEnd = 3;

      const target = () => indent({text, selStart, selEnd});

      expect(target).to.throw();
    });

    it('should fail if selection range is outside the text', () => {
      const text = 'hello';
      const selStart = -1;
      const selEnd = 100;

      const target = () => indent({text, selStart, selEnd});

      expect(target).to.throw();
    });

    it('should fail if selection start is greater than its end', () => {
      const text = 'hello';
      const selStart = 2;
      const selEnd = 1;

      const target = () => indent({text, selStart, selEnd});

      expect(target).to.throw();
    });
  });

  describe('no selection', () => {
    it('should insert indent to exact position', () => {
      const text = 'hello';
      const selStart = 4;
      const selEnd = 4;

      const res = indent({text, selStart, selEnd});

      expect(res.text).to.equal('hell  o');
      expect(res.selStart).to.equal(6);
      expect(res.selEnd).to.equal(6);
    });

    it('should remove indent from beginning of first line', () => {
      const text = '  hello';
      const selStart = 4;
      const selEnd = 4;

      const res = indent({text, selStart, selEnd, isInsert: false});

      expect(res.text).to.equal('hello');
      expect(res.selStart).to.equal(2);
      expect(res.selEnd).to.equal(2);
    });

    it('should remove indent when selection is on the end of line', () => {
      const text = 'first line\n second line\n third line';
      const selStart = 23; // last char of second line (\n)
      const selEnd = 23;

      const res = indent({text, selStart, selEnd, isInsert: false});

      expect(res.text).to.equal('first line\nsecond line\n third line');
      expect(res.selStart).to.equal(22);
      expect(res.selEnd).to.equal(22);
    });

    it('should remove single space from beginning of the line', () => {
      const text = 'first line\n second line\n third line';
      const selStart = 15; // second line
      const selEnd = 15;

      const res = indent({text, selStart, selEnd, isInsert: false});

      expect(res.text).to.equal('first line\nsecond line\n third line');
      expect(res.selStart).to.equal(14);
      expect(res.selEnd).to.equal(14);
    });

    it('should remove two spaces from beginning of the line', () => {
      const text = 'first line\n  second line\n third line';
      const selStart = 16; // second line
      const selEnd = 16;

      const res = indent({text, selStart, selEnd, isInsert: false});

      expect(res.text).to.equal('first line\nsecond line\n third line');
      expect(res.selStart).to.equal(14);
      expect(res.selEnd).to.equal(14);
    });

    it('should remove tabs from beginning of the line', () => {
      const text = 'first line\n\t\t\tsecond line\n third line';
      const selStart = 16; // second line
      const selEnd = 16;

      const res = indent({text, selStart, selEnd, isInsert: false});

      expect(res.text).to.equal('first line\n\tsecond line\n third line');
      expect(res.selStart).to.equal(14);
      expect(res.selEnd).to.equal(14);
    });

    it('should remove non-breaking spaces from beginning of the line', () => {
      const text = `first line\n${NBSP}${NBSP}${NBSP}second line\n third line`;
      const selStart = 16; // second line
      const selEnd = 16;

      const res = indent({text, selStart, selEnd, isInsert: false});

      expect(res.text).to.equal(`first line\n${NBSP}second line\n third line`);
      expect(res.selStart).to.equal(14);
      expect(res.selEnd).to.equal(14);
    });

    it('should not remove more spaces than indent size', () => {
      const text = 'first line\n   second line\n third line';
      const selStart = 17; // second line
      const selEnd = 17;

      const res = indent({text, selStart, selEnd, isInsert: false});

      expect(res.text).to.equal('first line\n second line\n third line');
      expect(res.selStart).to.equal(15);
      expect(res.selEnd).to.equal(15);
    });

    it('should not remove anything if no spaces at the beginning', () => {
      const text = 'first line\nsecond line\n third line';
      const selStart = 15; // second line
      const selEnd = 15;

      const res = indent({text, selStart, selEnd, isInsert: false});

      expect(res.text).to.equal('first line\nsecond line\n third line');
      expect(res.selStart).to.equal(15);
      expect(res.selEnd).to.equal(15);
    });
  });

  describe('selection inside single line', () => {
    it('should replace selected characters with indent', () => {
      const text = 'first line\n second line\n third line';
      const selStart = 12; // "s" in "second"
      const selEnd = 19; // "l" in "line"

      const res = indent({text, selStart, selEnd});

      expect(res.text).to.equal('first line\n   line\n third line');
      expect(res.selStart).to.equal(14);
      expect(res.selEnd).to.equal(14);
    });

    it('should replace selected characters at beginning of first line', () => {
      const text = 'first line\n second line\n third line';
      const selStart = 0;
      const selEnd = 2;

      const res = indent({text, selStart, selEnd});

      expect(res.text).to.equal('  rst line\n second line\n third line');
      expect(res.selStart).to.equal(2);
      expect(res.selEnd).to.equal(2);
    });

    it('should replace entire line with indent', () => {
      const text = 'first line\n second line\n third line';
      const selStart = 11; // first char of second line
      const selEnd = 23; // last char of second line (\n)

      const res = indent({text, selStart, selEnd});

      expect(res.text).to.equal('first line\n  \n third line');
      expect(res.selStart).to.equal(13);
      expect(res.selEnd).to.equal(13);
    });

    it('should remove single space from beginning of selected line', () => {
      const text = 'first line\n second line\n third line';
      const selStart = 12; // "s" in "second"
      const selEnd = 19; // "l" in "line"

      const res = indent({text, selStart, selEnd, isInsert: false});

      expect(res.text).to.equal('first line\nsecond line\n third line');
      expect(res.selStart).to.equal(11);
      expect(res.selEnd).to.equal(18);
    });

    it('should remove indent when entire line selected', () => {
      const text = 'first line\n second line\n third line';
      const selStart = 11; // first char of second line
      const selEnd = 23; // last char of second line (\n)

      const res = indent({text, selStart, selEnd, isInsert: false});

      expect(res.text).to.equal('first line\nsecond line\n third line');
      expect(res.selStart).to.equal(11);
      expect(res.selEnd).to.equal(22);
    });

    it('should remove tabs from beginning of selected line', () => {
      const text = 'first line\n\t\t\tsecond line\n third line';
      const selStart = 14; // "s" in "second"
      const selEnd = 21; // "l" in "line"

      const res = indent({text, selStart, selEnd, isInsert: false});

      expect(res.text).to.equal('first line\n\tsecond line\n third line');
      expect(res.selStart).to.equal(12);
      expect(res.selEnd).to.equal(19);
    });

    it('should remove non-breaking spaces from beginning of selected line', () => {
      const text = `first line\n${NBSP}${NBSP}${NBSP}second line\n third line`;
      const selStart = 14; // "s" in "second"
      const selEnd = 21; // "l" in "line"

      const res = indent({text, selStart, selEnd, isInsert: false});

      expect(res.text).to.equal(`first line\n${NBSP}second line\n third line`);
      expect(res.selStart).to.equal(12);
      expect(res.selEnd).to.equal(19);
    });

    it('should not remove more spaces than indent size', () => {
      const text = 'first line\n   second line\n third line';
      const selStart = 14; // "s" in "second"
      const selEnd = 21; // "l" in "line"

      const res = indent({text, selStart, selEnd, isInsert: false});

      expect(res.text).to.equal('first line\n second line\n third line');
      expect(res.selStart).to.equal(12);
      expect(res.selEnd).to.equal(19);
    });

    it('should not remove anything if no spaces at the beginning', () => {
      const text = 'first line\nsecond line\n third line';
      const selStart = 11; // "s" in "second"
      const selEnd = 18; // "l" in "line"

      const res = indent({text, selStart, selEnd, isInsert: false});

      expect(res.text).to.equal('first line\nsecond line\n third line');
      expect(res.selStart).to.equal(11);
      expect(res.selEnd).to.equal(18);
    });
  });

  describe('selection over several lines', () => {
    it('should insert indents to beginning of first and second lines', () => {
      const text = 'first line\n second line\n third line';
      const selStart = 5; // on first line
      const selEnd = 15; // on second line

      const res = indent({text, selStart, selEnd});

      expect(res.text).to.equal('  first line\n   second line\n third line');
      expect(res.selStart).to.equal(7);
      expect(res.selEnd).to.equal(19);
    });

    it('should insert indents to beginning of second and third lines', () => {
      const text = 'first line\n second line\n third line';
      const selStart = 11; // first char of second line
      const selEnd = 25; // second char of third line

      const res = indent({text, selStart, selEnd});

      expect(res.text).to.equal('first line\n   second line\n   third line');
      expect(res.selStart).to.equal(11);
      expect(res.selEnd).to.equal(29);
    });

    it('should not insert indent if selection end at line first char', () => {
      const text = 'first line\n second line\n third line';
      const selStart = 11; // first char of second line
      const selEnd = 24; // first char of third line

      const res = indent({text, selStart, selEnd});

      expect(res.text).to.equal('first line\n   second line\n third line');
      expect(res.selStart).to.equal(11);
      expect(res.selEnd).to.equal(26);
    });

    it('should insert indents when entire lines selected', () => {
      const text = 'first line\n second line\n third line';
      const selStart = 0; // first char of first line
      const selEnd = 23; // last char of second line (\n)

      const res = indent({text, selStart, selEnd});

      expect(res.text).to.equal('  first line\n   second line\n third line');
      expect(res.selStart).to.equal(0);
      expect(res.selEnd).to.equal(27);
    });

    it('should remove indents from beginning of first and second lines', () => {
      const text = ' first line\n   second line\n third line';
      const selStart = 6; // on first line
      const selEnd = 18; // on second line

      const res = indent({text, selStart, selEnd, isInsert: false});

      expect(res.text).to.equal('first line\n second line\n third line');
      expect(res.selStart).to.equal(5);
      expect(res.selEnd).to.equal(15);
    });

    it('should remove indents from beginning of second and third lines', () => {
      const text = 'first line\n   second line\nthird line';
      const selStart = 17; // on second line
      const selEnd = 28; // on third line

      const res = indent({text, selStart, selEnd, isInsert: false});

      expect(res.text).to.equal('first line\n second line\nthird line');
      expect(res.selStart).to.equal(15);
      expect(res.selEnd).to.equal(26);
    });

    it('should remove indents when entire lines selected', () => {
      const text = 'first line\n  second line\n  third line';
      const selStart = 11; // on second line
      const selEnd = 37; // on third line

      const res = indent({text, selStart, selEnd, isInsert: false});

      expect(res.text).to.equal('first line\nsecond line\nthird line');
      expect(res.selStart).to.equal(11);
      expect(res.selEnd).to.equal(33);
    });

    it('should remove tabs from beginning of second and third lines', () => {
      const text = 'first line\n\tsecond line\n\t\tthird line';
      const selStart = 17; // on second line
      const selEnd = 28; // on third line

      const res = indent({text, selStart, selEnd, isInsert: false});

      expect(res.text).to.equal('first line\nsecond line\nthird line');
      expect(res.selStart).to.equal(16);
      expect(res.selEnd).to.equal(25);
    });

    it('should remove non-breaking spaces from beginning of second and third lines', () => {
      const text = `first line\n${NBSP}${NBSP}second line\n${NBSP}third line`;
      const selStart = 17; // on second line
      const selEnd = 28; // on third line

      const res = indent({text, selStart, selEnd, isInsert: false});

      expect(res.text).to.equal('first line\nsecond line\nthird line');
      expect(res.selStart).to.equal(15);
      expect(res.selEnd).to.equal(25);
    });
  });
});
