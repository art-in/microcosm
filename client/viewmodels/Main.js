import EventedViewModel from './shared/EventedViewModel';

import Mindmap from './Mindmap';
import ApiAgent from 'client/lib/ApiAgent';

/**
 * Main view model
 */
export default class Main extends EventedViewModel {

    static eventTypes = [

        // state changed
        'change'
    ]

    apiAgent = new ApiAgent();

    /**
     * Mindmap model
     */
    mindmap = null;

    /**
     * Loads mindmap data
     * @return {promise.<boolean>} data loaded
     */
    async load() {
        if (await this.apiAgent.loadMindmap()) {
            this.onModelLoaded();
            return true;
        }

        return false;
    }

    /**
     * Handles mindmap loaded event
     */
    onModelLoaded() {
        this.mindmap = new Mindmap(this.apiAgent.mindmap);
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
        await this.apiAgent.createIdea(parentIdea);
        this.onModelLoaded();
    }

    /**
     * Handles idea change event
     * @param {Idea} idea
     */
    async onIdeaChange(idea) {
        await this.apiAgent.updateIdea(idea);
        this.onModelLoaded();
    }

    /**
     * Handles idea delete event
     * @param {Idea} idea
     */
    async onIdeaDelete(idea) {
        await this.apiAgent.deleteIdea(idea);
        this.onModelLoaded();
    }

    /**
     * Handles association change event
     * @param {Association} assoc
     */
    onAssocChange(assoc) {
        this.apiAgent.updateAssoc(assoc);
    }

    /**
     * Handles mindmap change event
     * @param {Mindmap} mindmap
     */
    onMindmapChange(mindmap) {
        this.apiAgent.updateMindmap(mindmap);
    }

}