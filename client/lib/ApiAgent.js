import Mindmap from 'models/Mindmap';
import Idea from 'models/Idea';
import Assoc from 'models/Assoc';

export default class ApiAgent {

    constructor() {
        this.mindmap = null;
    }

    async loadMindmap() {
        let mindmaps = await fetch('api/mindmaps')
            .then(data => data.json())
            .then(({items}) => items.map(i => new Mindmap(i)));

        if (mindmaps) {
            if (!mindmaps.length) {
                throw Error('No mindmaps were found.');
            }

            this.mindmap = mindmaps[0];

            let ideas = await fetch('api/ideas')
                .then(data => data.json())
                .then(({items}) => items.map(i => new Idea(i)));

            let assocs = await fetch('api/assocs')
                .then(data => data.json())
                .then(({items}) => items.map(i => new Assoc(i)));

            if (ideas && assocs) {
                this.mindmap.ideas = ideas;
                this.mindmap.assocs = assocs;

                return true;
            }
        }

        return false;
    }

    async createIdea(parentIdea) {
        console.log(`create idea: parent ${parentIdea}`);
        let {idea, assoc} = await fetch(
            `api/ideas?mmid=${this.mindmap.id}&piid=${parentIdea.id}`, {
                method: 'POST'
            })
            .then(data => data.json())
            .then(({rawIdea, rawAssoc}) => ({
                idea: new Idea(rawIdea),
                assoc: new Assoc(rawAssoc)
            }));
        this.mindmap.ideas.push(idea);
        this.mindmap.assocs.push(assoc);
    }

    async updateIdea(idea) {
        console.log(`update idea: ${idea}`);
        let {updated} = await fetch('api/ideas/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(idea)
        })
            .then(data => data.json());

        updated.ideas.forEach(rawIdea => {
            let idea = new Idea(rawIdea);
            let idx = this.mindmap.ideas.findIndex(i => i.id === idea.id);
            this.mindmap.ideas.splice(idx, 1);
            this.mindmap.ideas.push(idea);
        });
        updated.assocs.forEach(rawAssoc => {
            let assoc = new Assoc(rawAssoc);
            let idx = this.mindmap.assocs.findIndex(i => i.id === assoc.id);
            this.mindmap.assocs.splice(idx, 1);
            this.mindmap.assocs.push(assoc);
        });
    }

    async deleteIdea(idea) {
        console.log(`delete idea: ${idea.id}`);
        let {deleted} = await fetch(`api/ideas/${idea.id}`, {
            method: 'DELETE'
        }).then(data => data.json());
        deleted.ideas.forEach(ideaId => {
            let idx = this.mindmap.ideas.findIndex(i => i.id === ideaId);
            this.mindmap.ideas.splice(idx, 1);
        });
        deleted.assocs.forEach(assocId => {
            let idx = this.mindmap.assocs.findIndex(i => i.id === assocId);
            this.mindmap.assocs.splice(idx, 1);
        });
    }

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