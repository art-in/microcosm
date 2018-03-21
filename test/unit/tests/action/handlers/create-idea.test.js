import clone from 'clone';

import {expect} from 'test/utils';
import getRangeAroundNow from 'test/utils/get-range-around-now';

import Patch from 'src/utils/state/Patch';
import dateIsoRegexp from 'src/utils/date-iso-regexp';

import Mindset from 'src/model/entities/Mindset';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';
import Point from 'src/model/entities/Point';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('create-idea', () => {
  it('should add new idea', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'create-idea',
      data: {
        parentIdeaId: 'A',
        title: 'title test',
        value: 'value test'
      }
    });

    // check
    const mutations = patch['add-idea'];

    expect(mutations).to.have.length(1);
    const {idea} = mutations[0].data;
    const {assoc} = patch['add-association'][0].data;

    expect(idea).to.be.instanceOf(Idea);
    expect(idea.id).to.match(/\d+/);
    expect(idea.mindsetId).to.equal('m');
    expect(idea.title).to.equal('title test');
    expect(idea.value).to.equal('value test');
    expect(idea.edgesIn).to.deep.equal([assoc]);
    expect(idea.edgeFromParent).to.equal(assoc);
    expect(idea.edgesToChilds).to.deep.equal([]);
    expect(idea.rootPathWeight).to.equal(500);
  });

  it('should set specified idea ID', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'create-idea',
      data: {
        ideaId: 'test ID',
        parentIdeaId: 'A',
        title: 'title',
        value: ''
      }
    });

    // check
    const mutations = patch['add-idea'];

    expect(mutations).to.have.length(1);
    const {idea} = mutations[0].data;

    expect(idea.id).to.equal('test ID');
  });

  it('should trim title', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'create-idea',
      data: {
        ideaId: 'test ID',
        parentIdeaId: 'A',
        title: '     title      ',
        value: ''
      }
    });

    // check
    const mutations = patch['add-idea'];

    expect(mutations).to.have.length(1);
    const {idea} = mutations[0].data;

    expect(idea.title).to.equal('title');
  });

  it('should set empty-string to value if empty', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};

    // target
    let patch = new Patch();
    for (const v of ['', null, undefined]) {
      const p = handle(state, {
        type: 'create-idea',
        data: {parentIdeaId: 'A', title: 'title', value: v}
      });
      patch = Patch.combine(patch, p);
    }

    // check
    const mutations = patch['add-idea'];

    expect(mutations).to.have.length(3);

    for (const mutation of mutations) {
      const {idea} = mutation.data;
      expect(idea.value).to.equal('');
    }
  });

  it('should add association from parent idea', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'create-idea',
      data: {
        parentIdeaId: 'A',
        title: 'title',
        value: ''
      }
    });

    // check
    const mutations = patch['add-association'];

    expect(mutations).to.have.length(1);
    const {data} = mutations[0];
    const {idea: newIdea} = patch['add-idea'][0].data;

    expect(data.assoc).to.be.instanceOf(Association);
    expect(data.assoc.mindsetId).to.equal('m');
    expect(data.assoc.fromId).to.equal('A');
    expect(data.assoc.from).to.equal(ideaA);
    expect(data.assoc.toId).to.be.ok;
    expect(data.assoc.to).to.equal(newIdea);
    expect(data.assoc.weight).to.equal(500);
  });

  it('should update outgoing edges of parent idea', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'create-idea',
      data: {
        parentIdeaId: 'A',
        title: 'title',
        value: ''
      }
    });

    // check
    const mutations = patch['update-idea'];

    expect(mutations).to.have.length(1);
    const {data} = mutations[0];
    const {assoc} = patch['add-association'][0].data;

    expect(data).to.deep.equal({
      id: 'A',
      edgesOut: [assoc],
      edgesToChilds: [assoc]
    });
  });

  it('should set idea position relative to parent', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: {x: 0, y: 0},
      posAbs: {x: 10, y: 20},
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'create-idea',
      data: {
        parentIdeaId: 'A',
        title: 'title',
        value: ''
      }
    });

    // check
    const {idea} = patch['add-idea'][0].data;

    expect(idea).to.be.instanceOf(Idea);
    expect(idea.posRel).to.containSubset({x: 500, y: 0});
    expect(idea.posAbs).to.containSubset({x: 510, y: 20});
  });

  it('should set now as idea creation time', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'create-idea',
      data: {
        parentIdeaId: 'A',
        title: 'title test',
        value: 'value test'
      }
    });

    // check
    const mutations = patch['add-idea'];

    expect(mutations).to.have.length(1);
    const {idea} = mutations[0].data;

    const {nowStart, nowEnd} = getRangeAroundNow();

    expect(idea.createdOn).to.be.a('string');
    expect(idea.createdOn).to.match(dateIsoRegexp);
    expect(new Date(idea.createdOn)).to.be.withinTime(nowStart, nowEnd);
  });

  it('should set now as association creation time', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'create-idea',
      data: {
        parentIdeaId: 'A',
        title: 'title test',
        value: 'value test'
      }
    });

    // check
    const mutations = patch['add-association'];

    expect(mutations).to.have.length(1);
    const {assoc} = mutations[0].data;

    const {nowStart, nowEnd} = getRangeAroundNow();

    expect(assoc.createdOn).to.be.a('string');
    expect(assoc.createdOn).to.match(dateIsoRegexp);
    expect(new Date(assoc.createdOn)).to.be.withinTime(nowStart, nowEnd);
  });

  it('should set specified creation time to idea', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'create-idea',
      data: {
        parentIdeaId: 'A',
        createdOn: '2018-03-21T11:42:05.826Z',
        title: 'title test',
        value: 'value test'
      }
    });

    // check
    const mutations = patch['add-idea'];

    expect(mutations).to.have.length(1);
    const {idea} = mutations[0].data;

    expect(idea.createdOn).to.equal('2018-03-21T11:42:05.826Z');
  });

  it('should set specified creation time to association', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'create-idea',
      data: {
        parentIdeaId: 'A',
        createdOn: '2018-03-21T11:42:05.826Z',
        title: 'title test',
        value: 'value test'
      }
    });

    // check
    const mutations = patch['add-association'];

    expect(mutations).to.have.length(1);
    const {assoc} = mutations[0].data;

    expect(assoc.createdOn).to.equal('2018-03-21T11:42:05.826Z');
  });

  it('should normalize specified creation time', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'create-idea',
      data: {
        parentIdeaId: 'A',
        createdOn: '20180321T101132Z', // another form of ISO 8601 string
        title: 'title test',
        value: 'value test'
      }
    });

    // check
    const mutations = patch['add-idea'];

    expect(mutations).to.have.length(1);
    const {idea} = mutations[0].data;

    expect(idea.createdOn).to.equal('2018-03-21T10:11:32.000Z');
  });

  it('should NOT mutate state', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};
    const stateBefore = clone(state);

    // target
    handle(state, {
      type: 'create-idea',
      data: {
        parentIdeaId: 'A',
        title: 'title',
        value: ''
      }
    });

    // check
    expect(state).to.deep.equal(stateBefore);
  });

  it('should target all state layers', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'create-idea',
      data: {
        parentIdeaId: 'A',
        title: 'title',
        value: ''
      }
    });

    // check
    expect(patch.hasTarget('data')).to.be.true;
    expect(patch.hasTarget('model')).to.be.true;
    expect(patch.hasTarget('vm')).to.be.true;
    expect(patch.hasTarget('view')).to.be.true;
  });

  it('should fail if parent idea was not found', () => {
    // setup
    const mindset = new Mindset();

    const state = {model: {mindset}};

    // target
    const result = () =>
      handle(state, {
        type: 'create-idea',
        data: {
          parentIdeaId: 'not exist',
          title: 'title',
          value: ''
        }
      });

    // check
    expect(result).to.throw(`Idea 'not exist' was not found in mindset`);
  });

  it('should fail if title is empty', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};

    // target
    const target = () =>
      handle(state, {
        type: 'create-idea',
        data: {
          parentIdeaId: 'A',
          title: ' ',
          value: 'value test'
        }
      });

    // check
    expect(target).to.throw(`Invalid idea title ' '`);
  });

  it('should fail if title is too long', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};

    // target
    const result = () =>
      handle(state, {
        type: 'create-idea',
        data: {
          parentIdeaId: 'A',
          title: 'title'.padStart(51, 'long'),
          value: 'value test'
        }
      });

    // check
    expect(result).to.throw(
      `Invalid idea title '${'title'.padStart(51, 'long')}'`
    );
  });

  it('should fail if title is not a string', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};

    // target
    const target = () =>
      handle(state, {
        type: 'create-idea',
        data: {
          parentIdeaId: 'A',
          title: {},
          value: 'value test'
        }
      });

    // check
    expect(target).to.throw(`Invalid idea title '[object Object]'`);
  });

  it('should fail if value is not a string', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};

    // target
    const target = () =>
      handle(state, {
        type: 'create-idea',
        data: {
          parentIdeaId: 'A',
          title: 'title',
          value: true
        }
      });

    // check
    expect(target).to.throw(`Invalid idea value 'true'`);
  });

  it('should fail if invalid ISO 8601 creation time string', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};

    // target
    const result = () =>
      handle(state, {
        type: 'create-idea',
        data: {
          parentIdeaId: 'A',
          createdOn: 'INVALID TIME',
          title: 'title test',
          value: 'value test'
        }
      });

    // check
    expect(result).to.throw(
      `Invalid ISO 8601 creation time string 'INVALID TIME'`
    );
  });
});
