import Mindmap from 'domain/models/Mindmap';
import Idea from 'domain/models/Idea';
import Association from 'domain/models/Association';

/**
 * Loads mindmap
 * @return {promise.<Mindmap>} true if mindmap loaded,
 *                             false - if no mindmap was received
 */
export async function loadMindmap() {
    const mindmaps = await fetch('api/mindmaps')
        .then(data => data.json())
        .then(({items}) => items.map(i => new Mindmap(i)));

    if (!mindmaps.length) {
        throw Error('No mindmaps were received.');
    }

    const mindmap = mindmaps[0];

    const ideas = await fetch('api/ideas')
        .then(data => data.json())
        .then(({items}) => items.map(i => new Idea(i)));

    const assocs = await fetch('api/assocs')
        .then(data => data.json())
        .then(({items}) => items.map(i => new Association(i)));

    if (ideas && assocs) {
        mindmap.ideas = ideas;
        mindmap.assocs = assocs;
    }

    return new Mindmap(mindmap);
}

/**
 * Creates idea
 * @param {Mindmap} mindmap
 * @param {Idea} parentIdea
 */
export async function createIdea(mindmap, parentIdea) {
    console.log(`create idea: parent ${parentIdea}`);
    const {idea, assoc} = await fetch(
        `api/ideas?mmid=${mindmap.id}&piid=${parentIdea.id}`, {
            method: 'POST'
        })
        .then(data => data.json())
        .then(({idea, assoc}) => ({
            idea: new Idea(idea),
            assoc: new Association(assoc)
        }));

    mindmap.ideas.push(idea);
    mindmap.assocs.push(assoc);
}

/**
 * Updates idea
 * @param {Mindmap} mindmap
 * @param {Idea} idea
 */
export async function updateIdea(mindmap, idea) {
    console.log(`update idea: ${idea}`);
    const {updated} = await fetch('api/ideas/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(idea)
    })
        .then(data => data.json());

    updated.ideas.forEach(rawIdea => {
        const idea = new Idea(rawIdea);
        const idx = mindmap.ideas.findIndex(i => i.id === idea.id);
        mindmap.ideas.splice(idx, 1);
        mindmap.ideas.push(idea);
    });
    updated.assocs.forEach(rawAssoc => {
        const assoc = new Association(rawAssoc);
        const idx = mindmap.assocs.findIndex(i => i.id === assoc.id);
        mindmap.assocs.splice(idx, 1);
        mindmap.assocs.push(assoc);
    });
}

/**
 * Deletes idea
 * @param {Mindmap} mindmap
 * @param {Idea} idea
 */
export async function deleteIdea(mindmap, idea) {
    console.log(`delete idea: ${idea.id}`);
    const {deleted} = await fetch(`api/ideas/${idea.id}`, {
        method: 'DELETE'
    }).then(data => data.json());

    deleted.ideas.forEach(ideaId => {
        const idx = mindmap.ideas.findIndex(i => i.id === ideaId);
        mindmap.ideas.splice(idx, 1);
    });
    deleted.assocs.forEach(assocId => {
        const idx = mindmap.assocs.findIndex(i => i.id === assocId);
        mindmap.assocs.splice(idx, 1);
    });
}

/**
 * Updates association
 * @param {Association} assoc
 */
export async function updateAssoc(assoc) {
    console.log(`update assoc: ${assoc}`);
    await fetch('api/assocs/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(assoc)
    });
}

/**
 * Updates mindmap
 * @param {Mindmap} mindmap
 */
export async function updateMindmap(mindmap) {
    console.log(`update mindmap: ${mindmap}`);
    await fetch('api/mindmaps/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mindmap)
    });
}