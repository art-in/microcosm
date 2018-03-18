import PouchDB from 'pouchdb';
import clone from 'clone';

import guid from 'utils/guid';
import State from 'boot/client/State';
import Store from 'utils/state/Store';
import Handler from 'utils/state/Handler';
import combine from 'utils/state/combine-mutators';
import replicate from 'data/utils/replicate';
import {IDEA_TITLE_MAX_LENGTH} from 'action/utils/is-valid-idea-title';

import commonHandler from 'action/handler';
import mutateData from 'data/mutators';
import mutateModel from 'model/mutators';

import NoteType from './entities/Note';

/**
 * Maps notes to ideas/associations of temp mindset
 *
 * Q: why map to temp mindset and not right into current user mindset?
 * A: 1. this way whole operation is atomic. in case some notes failed to map
 *       for some reason - we are not ending up with partial result.
 *    2. temp mindset uses in-memory databases (fast). it does not trigger sync
 *       process with server databases on each update. once mapping is done we
 *       can batch-push all imported ideas at once.
 *
 * @param {Array.<NoteType>} notes
 * @param {State} state
 * @return {Promise.<{warnings:Array.<string>, databases:MindsetDatabases}>}
 */
export default async function mapNotesToIdeas(notes, state) {
  const warnings = [];

  const tmpState = await prepareTempState(state);
  const store = new Store(
    Handler.combine(commonHandler),
    combine([mutateData, mutateModel]),
    tmpState
  );

  // currently focused idea gonna be the mount point for imported ideas
  const focusIdeaId = state.model.mindset.focusIdeaId;
  if (!focusIdeaId) {
    throw Error('Focus idea ID is empty');
  }

  // map notes
  // split work between separate tasks, so in case we have a lot of notes,
  // mapping does not block task queue for long time.
  // Q: why process notes sequentially? we can run all tasks in parallel to
  //    increase performance (await Promise.all(tasks)) - to ~10x faster.
  // A: even though we split work between separate tasks, been run in parallel,
  //    a lot of them will choke tasks queue anyway, which slows down UI/UX
  //    interactions considerably. better approach here is to move heavy tasks
  //    like parsing/mapping to web worker, to free up main task queue.
  for (const note of notes) {
    await store.dispatch({
      type: 'create-idea',
      data: {
        parentIdeaId: focusIdeaId,
        title: normalizeTitle(note.title, warnings),
        value: note.content
      }
    });
  }

  return {warnings, databases: tmpState.data};
}

/**
 * Prepares temporary state
 *
 * @param {State} state
 * @return {Promise.<State>} temp state
 */
async function prepareTempState(state) {
  const tmpState = new State();

  // copy data and model states
  tmpState.model = clone(state.model);

  // use random db name to avoid name collisions (in-memory db is still global)
  tmpState.data.ideas = new PouchDB(guid(), {adapter: 'memory'});
  tmpState.data.associations = new PouchDB(guid(), {adapter: 'memory'});
  tmpState.data.mindsets = new PouchDB(guid(), {adapter: 'memory'});

  await Promise.all([
    replicate(state.data.ideas, tmpState.data.ideas),
    replicate(state.data.associations, tmpState.data.associations),
    replicate(state.data.mindsets, tmpState.data.mindsets)
  ]);

  return tmpState;
}

/**
 * Normalizes title
 *
 * @param {string} noteTitle
 * @param {Array.<string>} warnings
 * @return {string}
 */
function normalizeTitle(noteTitle, warnings) {
  let title = noteTitle;
  if (!title) {
    // we cannot allow empty title, so set smth like current date
    title = new Date().toISOString();
  }

  const maxLength = IDEA_TITLE_MAX_LENGTH;
  if (title.length > maxLength) {
    warnings.push(
      `While mapping note "${noteTitle}": ` +
        `Truncating title to ${maxLength} chars.`
    );
    title = title.slice(0, maxLength);
  }

  return title;
}
