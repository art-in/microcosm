import moment from 'moment';

import {createState, expect} from 'test/utils';
import getRangeAroundNow from 'test/utils/get-range-around-now';

import cloneState from 'src/boot/client/utils/clone-state-safely';
import Note from 'src/utils/import/entities/Note';
import Point from 'src/model/entities/Point';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';
import {IDEA_TITLE_MAX_LENGTH} from 'src/action/utils/is-valid-idea-title';

import * as ideasDbApi from 'src/data/db/ideas';
import * as assocsDbApi from 'src/data/db/associations';

import mapNotes from 'src/utils/import/map-notes-to-ideas';

describe('map-notes-to-ideas', () => {
  it('should add ideas to temp mindset database', async () => {
    // setup state
    const state = createState();

    const ideaA = new Idea({
      id: 'A',
      mindsetId: 'mindset id',
      isRoot: true,
      rootPathWeight: 0,
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      title: 'A title (existing)',
      value: 'A value (existing)',
      edgesToChilds: []
    });

    await ideasDbApi.add(state.data.ideas, ideaA);

    state.model.mindset.id = 'mindset id';
    state.model.mindset.root = ideaA;
    state.model.mindset.ideas.set(ideaA.id, ideaA);
    state.model.mindset.focusIdeaId = 'A';

    // setup notes
    const notes = [
      new Note({title: 'B title (imported)', content: 'B value (imported)'}),
      new Note({title: 'C title (imported)', content: 'C value (imported)'})
    ];

    // target
    const {warnings, databases} = await mapNotes(notes, state);

    // check
    const data = await databases.ideas.allDocs({include_docs: true});

    expect(warnings).to.be.empty;
    expect(data.rows).to.have.length(3);
    expect(data.rows).to.containSubset([
      {doc: {title: 'A title (existing)', value: 'A value (existing)'}},
      {doc: {title: 'B title (imported)', value: 'B value (imported)'}},
      {doc: {title: 'C title (imported)', value: 'C value (imported)'}}
    ]);
  });

  it('should NOT mutate received state', async () => {
    // setup state
    const state = createState();

    const rootIdea = new Idea({
      id: 'A',
      mindsetId: 'mindset id',
      isRoot: true,
      rootPathWeight: 0,
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      title: 'A title (existing)',
      value: 'A value (existing)',
      edgesToChilds: []
    });

    await ideasDbApi.add(state.data.ideas, rootIdea);

    state.model.mindset.id = 'mindset id';
    state.model.mindset.root = rootIdea;
    state.model.mindset.ideas.set(rootIdea.id, rootIdea);
    state.model.mindset.focusIdeaId = 'A';

    const stateBefore = cloneState(state);

    // setup notes
    const notes = [
      new Note({title: 'B title (imported)', content: 'B value (imported)'}),
      new Note({title: 'C title (imported)', content: 'C value (imported)'})
    ];

    // target
    const {warnings} = await mapNotes(notes, state);

    // check
    expect(state).to.deep.equal(stateBefore);

    const includeDocs = {include_docs: true};
    const ideasData = await state.data.ideas.allDocs(includeDocs);
    const assocsData = await state.data.associations.allDocs(includeDocs);
    const mindsetsData = await state.data.mindsets.allDocs(includeDocs);

    expect(warnings).to.be.empty;
    expect(assocsData.rows).to.have.length(0);
    expect(mindsetsData.rows).to.have.length(0);
    expect(ideasData.rows).to.have.length(1);
    expect(ideasData.rows).to.containSubset([
      {doc: {title: 'A title (existing)', value: 'A value (existing)'}}
    ]);
  });

  it('should add ideas as childs of currently focused idea', async () => {
    // setup state
    const state = createState();

    const ideaA = new Idea({
      id: 'A',
      mindsetId: 'mindset id',
      isRoot: true,
      rootPathWeight: 0,
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: []
    });

    const ideaB = new Idea({
      id: 'B',
      mindsetId: 'mindset id',
      isRoot: false,
      rootPathWeight: 0,
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: []
    });

    const assocAtoB = new Association({
      id: 'A to B',
      mindsetId: 'mindset id',
      fromId: 'A',
      from: ideaA,
      toId: 'B',
      to: ideaB
    });

    await ideasDbApi.add(state.data.ideas, ideaA);
    await ideasDbApi.add(state.data.ideas, ideaB);
    await assocsDbApi.add(state.data.associations, assocAtoB);

    state.model.mindset.id = 'mindset id';
    state.model.mindset.root = ideaA;
    state.model.mindset.ideas.set(ideaA.id, ideaA);
    state.model.mindset.ideas.set(ideaB.id, ideaB);
    state.model.mindset.associations.set(assocAtoB.id, assocAtoB);
    state.model.mindset.focusIdeaId = 'B';

    // setup notes
    const notes = [
      new Note({title: 'C title', content: 'C value'}),
      new Note({title: 'D title', content: 'D value'})
    ];

    // target
    const {warnings, databases} = await mapNotes(notes, state);

    // check
    const includeDocs = {include_docs: true};
    const ideasData = await databases.ideas.allDocs(includeDocs);
    const assocsData = await databases.associations.allDocs(includeDocs);

    expect(warnings).to.be.empty;
    expect(ideasData.rows).to.have.length(4);

    const ideaDataC = ideasData.rows.find(r => r.doc.title.startsWith('C'));
    const ideaDataD = ideasData.rows.find(r => r.doc.title.startsWith('D'));

    expect(assocsData.rows).to.have.length(3);
    expect(assocsData.rows).to.containSubset([
      {doc: {fromId: 'A', toId: 'B'}},
      {doc: {fromId: 'B', toId: ideaDataC.id}},
      {doc: {fromId: 'B', toId: ideaDataD.id}}
    ]);
  });

  it('should set import date to title if note title is empty', async () => {
    // setup state
    const state = createState();

    const ideaA = new Idea({
      id: 'A',
      mindsetId: 'mindset id',
      isRoot: true,
      rootPathWeight: 0,
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      title: 'A title (existing)',
      value: 'A value (existing)',
      edgesToChilds: []
    });

    await ideasDbApi.add(state.data.ideas, ideaA);

    state.model.mindset.id = 'mindset id';
    state.model.mindset.root = ideaA;
    state.model.mindset.ideas.set(ideaA.id, ideaA);
    state.model.mindset.focusIdeaId = 'A';

    // setup notes
    const notes = [
      new Note({title: '', content: ''}),
      new Note({title: null, content: null}),
      new Note({title: undefined, content: undefined})
    ];

    // target
    const {warnings, databases} = await mapNotes(notes, state);

    // check
    const data = await databases.ideas.allDocs({include_docs: true});

    expect(warnings).to.be.empty;
    expect(data.rows).to.have.length(4);
    const importedIdeas = data.rows
      .filter(r => !r.doc.title.includes('existing'))
      .map(r => r.doc);

    for (const ideaData of importedIdeas) {
      expect(moment(ideaData.title).isValid()).to.be.ok;
    }
  });

  it('should set empty-string to value if note value is empty', async () => {
    // setup state
    const state = createState();

    const ideaA = new Idea({
      id: 'A',
      mindsetId: 'mindset id',
      isRoot: true,
      rootPathWeight: 0,
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      title: 'A title (existing)',
      value: 'A value (existing)',
      edgesToChilds: []
    });

    await ideasDbApi.add(state.data.ideas, ideaA);

    state.model.mindset.id = 'mindset id';
    state.model.mindset.root = ideaA;
    state.model.mindset.ideas.set(ideaA.id, ideaA);
    state.model.mindset.focusIdeaId = 'A';

    // setup notes
    const notes = [
      new Note({title: '', content: ''}),
      new Note({title: null, content: null}),
      new Note({title: undefined, content: undefined})
    ];

    // target
    const {warnings, databases} = await mapNotes(notes, state);

    // check
    const data = await databases.ideas.allDocs({include_docs: true});

    expect(warnings).to.be.empty;
    expect(data.rows).to.have.length(4);
    const importedIdeas = data.rows
      .filter(r => !r.doc.title.includes('existing'))
      .map(r => r.doc);

    for (const ideaData of importedIdeas) {
      expect(ideaData.value).to.equal('');
    }
  });

  it('should truncate title if it is above length limit', async () => {
    // setup state
    const state = createState();

    const ideaA = new Idea({
      id: 'A',
      mindsetId: 'mindset id',
      isRoot: true,
      rootPathWeight: 0,
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      title: 'A title (existing)',
      value: 'A value (existing)',
      edgesToChilds: []
    });

    await ideasDbApi.add(state.data.ideas, ideaA);

    state.model.mindset.id = 'mindset id';
    state.model.mindset.root = ideaA;
    state.model.mindset.ideas.set(ideaA.id, ideaA);
    state.model.mindset.focusIdeaId = 'A';

    // setup notes
    const notes = [
      new Note({title: ''.padStart(IDEA_TITLE_MAX_LENGTH + 1, '-')})
    ];

    // target
    const {warnings, databases} = await mapNotes(notes, state);

    // check
    const data = await databases.ideas.allDocs({include_docs: true});

    const importedIdeas = data.rows
      .filter(r => !r.doc.title.includes('existing'))
      .map(r => r.doc);

    expect(warnings).to.have.length(1);
    expect(warnings[0]).to.match(
      /^While mapping note "-+": Truncating title to \d+ chars\.$/
    );

    expect(importedIdeas).to.have.length(1);
    expect(importedIdeas[0].title).to.have.length(IDEA_TITLE_MAX_LENGTH);
  });

  it('should avoid race condition while adding ideas', async () => {
    // setup state
    const state = createState();

    const ideaA = new Idea({
      id: 'A',
      mindsetId: 'mindset id',
      isRoot: true,
      rootPathWeight: 0,
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      title: 'A title (existing)',
      value: 'A value (existing)',
      edgesToChilds: []
    });

    await ideasDbApi.add(state.data.ideas, ideaA);

    state.model.mindset.id = 'mindset id';
    state.model.mindset.root = ideaA;
    state.model.mindset.ideas.set(ideaA.id, ideaA);
    state.model.mindset.focusIdeaId = 'A';

    // setup notes
    const notes = [
      new Note({title: 'B title (imported)', content: 'B value (imported)'}),
      new Note({title: 'C title (imported)', content: 'C value (imported)'})
    ];

    // target
    const {warnings, databases} = await mapNotes(notes, state);

    // check
    const ideasData = await databases.ideas.allDocs({include_docs: true});

    expect(warnings).to.be.empty;
    expect(ideasData.rows).to.have.length(3);

    const dataA = ideasData.rows.find(r => r.doc.title.startsWith('A')).doc;
    const dataB = ideasData.rows.find(r => r.doc.title.startsWith('B')).doc;
    const dataC = ideasData.rows.find(r => r.doc.title.startsWith('C')).doc;

    // ensure no race conditioning while adding new ideas, which otherwise
    // would result in equal positions for B and C
    expect(dataA.posRel).to.not.deep.equal(dataB.posRel);
    expect(dataA.posRel).to.not.deep.equal(dataC.posRel);
    expect(dataB.posRel).to.not.deep.equal(dataC.posRel);
  });

  it('should map creation time', async () => {
    // setup state
    const state = createState();

    /** @type {DateTimeISO} */
    const timeA = '2000-01-01T01:01:01.000Z';

    const ideaA = new Idea({
      id: 'A',
      createdOn: timeA,
      mindsetId: 'mindset id',
      isRoot: true,
      rootPathWeight: 0,
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      title: 'A title (existing)',
      value: 'A value (existing)',
      edgesToChilds: []
    });

    await ideasDbApi.add(state.data.ideas, ideaA);

    state.model.mindset.id = 'mindset id';
    state.model.mindset.root = ideaA;
    state.model.mindset.ideas.set(ideaA.id, ideaA);
    state.model.mindset.focusIdeaId = 'A';

    // setup notes
    /** @type {DateTimeISO} */
    const timeB = '2018-03-21T10:11:32.001Z';

    const notes = [
      new Note({title: 'B title (imported)', createdOn: timeB}),
      new Note({title: 'C title (imported)', createdOn: undefined})
    ];

    // target
    const {warnings, databases} = await mapNotes(notes, state);

    // check
    const ideasData = await databases.ideas.allDocs({include_docs: true});

    expect(warnings).to.be.empty;
    expect(ideasData.rows).to.have.length(3);

    const dataA = ideasData.rows.find(r => r.doc.title.startsWith('A')).doc;
    const dataB = ideasData.rows.find(r => r.doc.title.startsWith('B')).doc;
    const dataC = ideasData.rows.find(r => r.doc.title.startsWith('C')).doc;

    const {nowStart, nowEnd} = getRangeAroundNow();

    expect(dataA.createdOn).to.equal(timeA);
    expect(dataB.createdOn).to.equal(timeB);
    expect(new Date(dataC.createdOn)).to.be.withinTime(nowStart, nowEnd);
  });
});
