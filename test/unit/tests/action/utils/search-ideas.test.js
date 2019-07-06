import {expect} from 'test/utils';

import Mindset from 'src/model/entities/Mindset';
import Idea from 'src/model/entities/Idea';

import searchIdeas from 'action/utils/search-ideas';

describe('search-ideas', () => {
  it('should search in idea titles', () => {
    // setup
    const mindset = new Mindset({id: 'm'});

    const idea1 = new Idea({
      id: 'idea 1',
      title: '---#NOTFOUND#---'
    });
    const idea2 = new Idea({
      id: 'idea 2',
      title: '---#FOUND#---'
    });

    mindset.ideas.set(idea1.id, idea1);
    mindset.ideas.set(idea2.id, idea2);

    // target
    const result = searchIdeas(mindset, {
      phrase: '#FOUND#'
    });

    // check
    expect(result).to.have.length(1);
    expect(result[0].id).to.equal('idea 2');
  });

  it('should search in idea values', () => {
    // setup
    const mindset = new Mindset({id: 'm'});

    const idea1 = new Idea({
      id: 'idea 1',
      value: '---#FOUND#---'
    });
    const idea2 = new Idea({
      id: 'idea 2',
      value: '---#NOTFOUND#---'
    });
    const idea3 = new Idea({
      id: 'idea 3',
      value: '---#FOUND#---'
    });

    mindset.ideas.set(idea1.id, idea1);
    mindset.ideas.set(idea2.id, idea2);
    mindset.ideas.set(idea3.id, idea3);

    // target
    const result = searchIdeas(mindset, {
      phrase: '#FOUND#'
    });

    // check
    expect(result).to.have.length(2);
    expect(result[0].id).to.equal('idea 1');
    expect(result[1].id).to.equal('idea 3');
  });

  it('should ignore case', () => {
    // setup
    const mindset = new Mindset({id: 'm'});

    const idea1 = new Idea({
      id: 'idea 1',
      title: '   FOUND'
    });
    const idea2 = new Idea({
      id: 'idea 2',
      value: 'Found   '
    });

    mindset.ideas.set(idea1.id, idea1);
    mindset.ideas.set(idea2.id, idea2);

    // target
    const result = searchIdeas(mindset, {
      phrase: 'found'
    });

    // check
    expect(result).to.have.length(2);
  });

  it('should escape regexp special characters', () => {
    // setup
    const mindset = new Mindset({id: 'm'});

    const idea1 = new Idea({
      id: 'idea 1',
      value: 'c++[{('
    });

    mindset.ideas.set(idea1.id, idea1);

    // target
    const result = searchIdeas(mindset, {
      phrase: 'c++[{('
    });

    // check
    expect(result).to.have.length(1);
    expect(result[0].id).to.equal('idea 1');
  });

  it('should NOT return ideas from exclude list', () => {
    // setup
    const mindset = new Mindset({id: 'm'});

    const idea1 = new Idea({
      id: 'idea 1',
      value: 'phrase'
    });
    const idea2 = new Idea({
      id: 'idea 2',
      value: 'phrase'
    });

    mindset.ideas.set(idea1.id, idea1);
    mindset.ideas.set(idea2.id, idea2);

    // target
    const result = searchIdeas(mindset, {
      phrase: 'phrase',
      excludeIds: ['idea 1']
    });

    // check
    expect(result).to.have.length(1);
    expect(result[0].id).to.equal('idea 2');
  });

  it('should return empty array if no ideas found', () => {
    // setup
    const mindset = new Mindset({id: 'm'});

    const idea1 = new Idea({
      id: 'idea 1',
      value: '---#NOTFOUND#---'
    });
    const idea2 = new Idea({
      id: 'idea 2',
      value: '---#NOTFOUND#---'
    });

    mindset.ideas.set(idea1.id, idea1);
    mindset.ideas.set(idea2.id, idea2);

    // target
    const result = searchIdeas(mindset, {
      phrase: '#FOUND#'
    });

    // check
    expect(result).to.have.length(0);
  });

  it('should fail if search string is empty', () => {
    // setup
    const mindset = new Mindset({id: 'm'});

    const idea1 = new Idea({
      id: 'idea 1',
      value: '---#NOTFOUND#---'
    });
    const idea2 = new Idea({
      id: 'idea 2',
      value: '---#NOTFOUND#---'
    });

    mindset.ideas.set(idea1.id, idea1);
    mindset.ideas.set(idea2.id, idea2);

    // target
    const result = () =>
      searchIdeas(mindset, {
        phrase: ''
      });

    // check
    expect(result).to.throw('Search string is empty');
  });
});
