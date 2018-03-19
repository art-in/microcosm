import {EventEmitter} from 'events';
import {stub, spy} from 'sinon';

import {createState, expect} from 'test/utils';

import Idea from 'model/entities/Idea';
import ImportStatus from 'utils/import/entities/ImportStatus';
import ImportSource from 'src/utils/import/entities/ImportSource';
import ImportSourceType from 'src/utils/import/entities/ImportSourceType';
import NotebookType from 'src/utils/import/entities/NotebookType';
import Point from 'model/entities/Point';
import cloneState from 'src/boot/client/utils/clone-state-safely';
import * as ideasDbApi from 'src/data/db/ideas';

import enex from './evernote/cases';

import importIdeas from 'src/utils/import/import-ideas';

describe('import-ideas', () => {
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

    // setup source
    const source = new ImportSource({
      notebook: NotebookType.evernote,
      type: ImportSourceType.text,
      text: enex['basic-single-note']
    });

    // setup events
    const events = new EventEmitter();

    // target
    const result = importIdeas(source, state, events);

    // check
    const databases = await result.done;
    const ideasData = await databases.ideas.allDocs({include_docs: true});

    expect(ideasData.rows).to.have.length(2);
    expect(ideasData.rows).to.containSubset([
      {doc: {title: 'A title (existing)', value: 'A value (existing)'}},
      {doc: {title: 'TEST TITLE', value: 'TEST VALUE'}}
    ]);
  });

  it('should NOT mutate received state', async () => {
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

    // setup source
    const source = new ImportSource({
      notebook: NotebookType.evernote,
      type: ImportSourceType.text,
      text: enex['basic-single-note']
    });

    // setup events
    const events = new EventEmitter();

    const stateBefore = cloneState(state);

    // target
    const result = importIdeas(source, state, events);

    // check
    await result.done;

    expect(state).to.deep.equal(stateBefore);

    const includeDocs = {include_docs: true};
    const ideasData = await state.data.ideas.allDocs(includeDocs);
    const assocsData = await state.data.associations.allDocs(includeDocs);
    const mindsetsData = await state.data.mindsets.allDocs(includeDocs);

    expect(assocsData.rows).to.have.length(0);
    expect(mindsetsData.rows).to.have.length(0);
    expect(ideasData.rows).to.have.length(1);
    expect(ideasData.rows).to.containSubset([
      {doc: {title: 'A title (existing)', value: 'A value (existing)'}}
    ]);
  });

  it('should load from file source', async () => {
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

    // setup source
    const source = new ImportSource({
      notebook: NotebookType.evernote,
      type: ImportSourceType.file,
      file: new File([enex['basic-single-note']], 'file.enex')
    });

    // setup events
    const events = new EventEmitter();

    // target
    const result = importIdeas(source, state, events);

    // check
    await expect(result.done).to.not.be.rejectedWith();
  });

  it('should load from text source', async () => {
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

    // setup source
    const source = new ImportSource({
      notebook: NotebookType.evernote,
      type: ImportSourceType.text,
      text: enex['basic-single-note']
    });

    // setup events
    const events = new EventEmitter();

    // target
    const result = importIdeas(source, state, events);

    // check
    await expect(result.done).to.not.be.rejectedWith();
  });

  it(`should emit 'status-change' events`, async () => {
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

    // setup source
    const source = new ImportSource({
      notebook: NotebookType.evernote,
      type: ImportSourceType.text,
      text: enex['basic-single-note']
    });

    // setup events
    const events = new EventEmitter();
    const emitStub = stub(events, 'emit');

    // target
    const result = importIdeas(source, state, events);

    // check
    await result.done;

    const statusChanges = emitStub
      .getCalls()
      .filter(c => c.args[0] === 'status-change')
      .map(c => c.args[1]);

    expect(statusChanges).to.have.length(5);
    expect(statusChanges).to.deep.equal([
      ImportStatus.started,
      ImportStatus.loading,
      ImportStatus.parsing,
      ImportStatus.mapping,
      ImportStatus.succeed
    ]);
  });

  it(`should emit 'warn' events`, async () => {
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

    // setup source
    const source = new ImportSource({
      notebook: NotebookType.evernote,
      type: ImportSourceType.text,
      text: enex['resources-multiple']
    });

    // setup events
    const events = new EventEmitter();
    const emitStub = stub(events, 'emit');

    // target
    const result = importIdeas(source, state, events);

    // check
    await result.done;

    const warns = emitStub
      .getCalls()
      .filter(c => c.args[0] === 'warn')
      .map(c => c.args[1]);

    expect(warns).to.have.length(1);

    const prefix = `While parsing note "MULTIPLE RESOURCES": `;
    expect(warns[0]).to.deep.equal([
      prefix + `Ignoring resource of type 'audio/mpeg'.`,
      prefix + `Ignoring resource of type 'text/plain'.`,
      prefix + `Ignoring resource of type 'application/pdf'.`
    ]);
  });

  it(`should finish if canceled while loading file source`, async () => {
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

    // setup source
    const source = new ImportSource({
      notebook: NotebookType.evernote,
      type: ImportSourceType.file,
      file: new File([enex['basic-single-note']], 'file.enex')
    });

    // setup events
    const events = new EventEmitter();
    const emitStub = stub(events, 'emit');

    // target
    const result = importIdeas(source, state, events);
    result.token.isCanceled = true;

    // check
    const databases = await result.done;
    expect(databases).to.equal(null);

    const statusChanges = emitStub
      .getCalls()
      .filter(c => c.args[0] === 'status-change')
      .map(c => c.args[1]);

    expect(statusChanges).to.have.length(3);
    expect(statusChanges).to.deep.equal([
      ImportStatus.started,
      ImportStatus.loading,
      ImportStatus.canceled
    ]);
  });

  it(`should finish if canceled while loading text source`, async () => {
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

    // setup source
    const source = new ImportSource({
      notebook: NotebookType.evernote,
      type: ImportSourceType.text,
      text: enex['basic-single-note']
    });

    // setup events
    const events = new EventEmitter();
    const emitStub = stub(events, 'emit');

    // target
    const result = importIdeas(source, state, events);
    result.token.isCanceled = true;

    // check
    const databases = await result.done;
    expect(databases).to.equal(null);

    const statusChanges = emitStub
      .getCalls()
      .filter(c => c.args[0] === 'status-change')
      .map(c => c.args[1]);

    expect(statusChanges).to.have.length(4);
    expect(statusChanges).to.deep.equal([
      ImportStatus.started,
      ImportStatus.loading,
      ImportStatus.parsing, // text loading is sync, so parsing sneaks in.
      ImportStatus.canceled
    ]);
  });

  it(`should finish if canceled while parsing`, async () => {
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

    // setup source
    const source = new ImportSource({
      notebook: NotebookType.evernote,
      type: ImportSourceType.file,
      file: new File([enex['basic-single-note']], 'file.enex')
    });

    // setup events
    const events = new EventEmitter();
    const emitSpy = (events.emit = spy(events.emit));

    // target
    const result = importIdeas(source, state, events);
    events.on('status-change', status => {
      if (status === ImportStatus.parsing) {
        result.token.isCanceled = true;
      }
    });

    // check
    const databases = await result.done;
    expect(databases).to.equal(null);

    const statusChanges = emitSpy
      .getCalls()
      .filter(c => c.args[0] === 'status-change')
      .map(c => c.args[1]);

    expect(statusChanges).to.have.length(4);
    expect(statusChanges).to.deep.equal([
      ImportStatus.started,
      ImportStatus.loading,
      ImportStatus.parsing,
      ImportStatus.canceled
    ]);
  });

  it(`should finish if canceled while mapping`, async () => {
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

    // setup source
    const source = new ImportSource({
      notebook: NotebookType.evernote,
      type: ImportSourceType.file,
      file: new File([enex['basic-single-note']], 'file.enex')
    });

    // setup events
    const events = new EventEmitter();
    const emitSpy = (events.emit = spy(events.emit));

    // target
    const result = importIdeas(source, state, events);
    events.on('status-change', status => {
      if (status === ImportStatus.mapping) {
        result.token.isCanceled = true;
      }
    });

    // check
    const databases = await result.done;
    expect(databases).to.equal(null);

    const statusChanges = emitSpy
      .getCalls()
      .filter(c => c.args[0] === 'status-change')
      .map(c => c.args[1]);

    expect(statusChanges).to.have.length(5);
    expect(statusChanges).to.deep.equal([
      ImportStatus.started,
      ImportStatus.loading,
      ImportStatus.parsing,
      ImportStatus.mapping,
      ImportStatus.canceled
    ]);
  });

  it('should fail if loading failed', async () => {
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

    // setup source
    const source = new ImportSource({
      notebook: NotebookType.evernote,
      type: -1 // unknown source type
    });

    // setup events
    const events = new EventEmitter();
    const emitStub = stub(events, 'emit');

    // target
    const result = importIdeas(source, state, events);

    // check
    await expect(result.done).to.be.rejectedWith(
      `Unknown source data type '-1'`
    );

    const statusChanges = emitStub
      .getCalls()
      .filter(c => c.args[0] === 'status-change')
      .map(c => c.args[1]);

    expect(statusChanges).to.have.length(3);
    expect(statusChanges).to.deep.equal([
      ImportStatus.started,
      ImportStatus.loading,
      ImportStatus.failed
    ]);
  });

  it('should fail if parsing failed', async () => {
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

    // setup source
    const source = new ImportSource({
      notebook: NotebookType.evernote,
      type: ImportSourceType.text,
      text: enex['invalid-enex-empty']
    });

    // setup events
    const events = new EventEmitter();
    const emitStub = stub(events, 'emit');

    // target
    const result = importIdeas(source, state, events);

    // check
    await expect(result.done).to.be.rejectedWith('Received ENEX is empty');

    const statusChanges = emitStub
      .getCalls()
      .filter(c => c.args[0] === 'status-change')
      .map(c => c.args[1]);

    expect(statusChanges).to.have.length(4);
    expect(statusChanges).to.deep.equal([
      ImportStatus.started,
      ImportStatus.loading,
      ImportStatus.parsing,
      ImportStatus.failed
    ]);
  });

  it('should fail if mapping failed', async () => {
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
    state.model.mindset.focusIdeaId = null;

    // setup source
    const source = new ImportSource({
      notebook: NotebookType.evernote,
      type: ImportSourceType.text,
      text: enex['basic-single-note']
    });

    // setup events
    const events = new EventEmitter();
    const emitStub = stub(events, 'emit');

    // target
    const result = importIdeas(source, state, events);

    // check
    await expect(result.done).to.be.rejectedWith('Focus idea ID is empty');

    const statusChanges = emitStub
      .getCalls()
      .filter(c => c.args[0] === 'status-change')
      .map(c => c.args[1]);

    expect(statusChanges).to.have.length(5);
    expect(statusChanges).to.deep.equal([
      ImportStatus.started,
      ImportStatus.loading,
      ImportStatus.parsing,
      ImportStatus.mapping,
      ImportStatus.failed
    ]);
  });
});
