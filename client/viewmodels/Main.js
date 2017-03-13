import EventedViewModel from './shared/EventedViewModel';

import Mindmap from './Mindmap';
import * as apiAgent from 'client/lib/api-agent';

/**
 * Main view model
 */
export default class Main extends EventedViewModel {

    static eventTypes = [

        // state changed
        'change'
    ]

    /**
     * Mindmap view model
     * @type {Mindmap}
     */
    mindmap;

    /**
     * Handles component mount event
     */
    async onMount() {
        const model = await apiAgent.loadMindmap();
        this.onModelLoaded(model);
    }

    /**
     * Handles mindmap loaded event
     */
    onModelLoaded(model) {

        this.mindmap = new Mindmap(model);

        this.addMindmapHandlers();
        this.emit('change');
    }

    /**
     * Binds mindmap events
     */
    addMindmapHandlers() {
        this.mindmap.on('ideaAdd', this.onIdeaAdd.bind(this));
        this.mindmap.on('ideaChange', this.onIdeaChange.bind(this));
        this.mindmap.on('ideaDelete', this.onIdeaDelete.bind(this));
        this.mindmap.on('assocChange', this.onAssocChange.bind(this));
        this.mindmap.on('mindmapChange', this.onMindmapChange.bind(this));
    }

    /**
     * Handles idea add event
     * @param {Idea} parentIdea
     */
    async onIdeaAdd(parentIdea) {
        await apiAgent.createIdea(this.mindmap.model, parentIdea);
        this.onModelLoaded(this.mindmap.model);
    }

    /**
     * Handles idea change event
     * @param {Idea} idea
     */
    async onIdeaChange(idea) {
        await apiAgent.updateIdea(this.mindmap.model, idea);
        this.onModelLoaded(this.mindmap.model);
    }

    /**
     * Handles idea delete event
     * @param {Idea} idea
     */
    async onIdeaDelete(idea) {
        await apiAgent.deleteIdea(this.mindmap.model, idea);
        this.onModelLoaded(this.mindmap.model);
    }

    /**
     * Handles association change event
     * @param {Association} assoc
     */
    onAssocChange(assoc) {
        apiAgent.updateAssoc(assoc);
    }

    /**
     * Handles mindmap change event
     * @param {Mindmap} mindmap
     */
    onMindmapChange(mindmap) {
        apiAgent.updateMindmap(mindmap);
    }

}