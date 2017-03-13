import Mindmap from 'models/Mindmap';
import Idea from 'models/Idea';
import Association from 'models/Association';

/**
 * API wrapper
 */
export default class ApiAgent {

    /**
     * Loaded mindmap instance
     */
    mindmap = null;

    /**
     * Loads mindmap
     * @return {promise.<boolean>} true if mindmap loaded,
     *                             false - if no mindmap was received
     */
    async loadMindmap() {
        const mindmaps = await fetch('api/mindmaps')
            .then(data => data.json())
            .then(({items}) => items.map(i => new Mindmap(i)));

        if (mindmaps) {
            if (!mindmaps.length) {
                throw Error('No mindmaps were found.');
            }

            this.mindmap = mindmaps[0];

            const ideas = await fetch('api/ideas')
                .then(data => data.json())
                .then(({items}) => items.map(i => new Idea(i)));

            const assocs = await fetch('api/assocs')
                .then(data => data.json())
                .then(({items}) => items.map(i => new Association(i)));

            if (ideas && assocs) {
                this.mindmap.ideas = ideas;
                this.mindmap.assocs = assocs;

                return true;
            }
        }

        return false;
    }

    /**
     * Creates idea
     * @param {Idea} parentIdea
     */
    async createIdea(parentIdea) {
        console.log(`create idea: parent ${parentIdea}`);
        const {idea, assoc} = await fetch(
            `api/ideas?mmid=${this.mindmap.id}&piid=${parentIdea.id}`, {
                method: 'POST'
            })
            .then(data => data.json())
            .then(({rawIdea, rawAssoc}) => ({
                idea: new Idea(rawIdea),
                assoc: new Association(rawAssoc)
            }));
        this.mindmap.ideas.push(idea);
        this.mindmap.assocs.push(assoc);
    }

    /**
     * Updates idea
     * @param {Idea} idea
     */
    async updateIdea(idea) {
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
            const idx = this.mindmap.ideas.findIndex(i => i.id === idea.id);
            this.mindmap.ideas.splice(idx, 1);
            this.mindmap.ideas.push(idea);
        });
        updated.assocs.forEach(rawAssoc => {
            const assoc = new Association(rawAssoc);
            const idx = this.mindmap.assocs.findIndex(i => i.id === assoc.id);
            this.mindmap.assocs.splice(idx, 1);
            this.mindmap.assocs.push(assoc);
        });
    }

    /**
     * Deletes idea
     * @param {Idea} idea
     */
    async deleteIdea(idea) {
        console.log(`delete idea: ${idea.id}`);
        const {deleted} = await fetch(`api/ideas/${idea.id}`, {
            method: 'DELETE'
        }).then(data => data.json());
        deleted.ideas.forEach(ideaId => {
            const idx = this.mindmap.ideas.findIndex(i => i.id === ideaId);
            this.mindmap.ideas.splice(idx, 1);
        });
        deleted.assocs.forEach(assocId => {
            const idx = this.mindmap.assocs.findIndex(i => i.id === assocId);
            this.mindmap.assocs.splice(idx, 1);
        });
    }

    /**
     * Updates association
     * @param {Association} assoc
     */
    async updateAssoc(assoc) {
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
    async updateMindmap(mindmap) {
        console.log(`update mindmap: ${mindmap}`);
        await fetch('api/mindmaps/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mindmap)
        });
    }

}