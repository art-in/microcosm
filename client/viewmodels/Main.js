import EventedViewModel from './shared/EventedViewModel';

import Mindmap from './Mindmap';
import ApiAgent from 'client/lib/ApiAgent';

export default class Main extends EventedViewModel {

    static eventTypes() {
        return [
            'change'
        ];
    }

    constructor() {
        super();

        this.apiAgent = new ApiAgent();

        this.mindmap = null;
    }

    //region publics

    async load() {
        if (await this.apiAgent.loadMindmap()) {
            onModelChange.call(this);
            return true;
        }

        return false;
    }

    //endregion

}

//region privates

function addMindmapHandlers() {
    this.mindmap.on('ideaAdd', onIdeaAdd.bind(this));
    this.mindmap.on('ideaChange', onIdeaChange.bind(this));
    this.mindmap.on('ideaDelete', onIdeaDelete.bind(this));
    this.mindmap.on('assocChange', onAssocChange.bind(this));
    this.mindmap.on('mindmapChange', onMindmapChange.bind(this));
}

//endregion

//region handlers

function onModelChange() {
    this.mindmap = new Mindmap(this.apiAgent.mindmap);
    addMindmapHandlers.call(this);
    this.emit('change');
}

async function onIdeaAdd(parentIdea) {
    await this.apiAgent.createIdea(parentIdea);
    onModelChange.call(this);
}

async function onIdeaChange(idea) {
    await this.apiAgent.updateIdea(idea);
    onModelChange.call(this);
}

async function onIdeaDelete(idea) {
    await this.apiAgent.deleteIdea(idea);
    onModelChange.call(this);
}

function onAssocChange(assoc) {
    this.apiAgent.updateAssoc(assoc);
}

function onMindmapChange(mindmap) {
    this.apiAgent.updateMindmap(mindmap);
}

//endregion