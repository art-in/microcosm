import addAssociation from './add-association';
import addIdea from './add-idea';
import init from './init';
import removeAssociation from './remove-association';
import removeIdea from './remove-idea';
import updateAssociation from './update-association';
import updateIdea from './update-idea';
import updateMindmap from './update-mindmap';

/**
 * Applies patch to model state
 * @param {object} state
 * @param {Patch} patch
 * @return {object} new state
 */
export default async function mutate(state, patch) {
    
    let newState = state;

    await Promise.all(patch.map(async function(mutation) {
        if (mutation.hasTarget('model')) {
            newState = await apply(newState, mutation);
        }
    }));

    return newState;
}

/**
 * Applies single mutation to state
 * 
 * @param {object} state
 * @param {{type, data}} mutation
 * @return {object} new state
 */
async function apply(state, mutation) {

    let newState;

    const data = mutation.data;

    switch (mutation.type) {

    case 'init':
        newState = await init(state, data);
        break;

    case 'add idea':
        newState = await addIdea(state, data);
        break;

    case 'update idea':
        newState = await updateIdea(state, data);
        break;

    case 'remove idea':
        newState = await removeIdea(state, data);
        break;

    case 'add association':
        newState = await addAssociation(state, data);
        break;

    case 'update association':
        newState = await updateAssociation(state, data);
        break;

    case 'remove association':
        newState = await removeAssociation(state, data);
        break;

    case 'update mindmap':
        newState = await updateMindmap(state, data);
        break;

    default:
        throw Error(`Unknown mutation '${mutation.type}'`);
    }

    return newState;
}