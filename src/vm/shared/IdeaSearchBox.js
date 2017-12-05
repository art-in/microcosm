import ViewModel from 'vm/utils/ViewModel';

import Lookup from './Lookup';

/**
 * Idea search box
 */
export default class IdeaSearchBox extends ViewModel {

    /**
     * Is in searching state
     * @type {boolean}
     */
    active = false;

    /**
     * Idea search lookup
     * @type {Lookup|undefined}
     */
    lookup = new Lookup({
        placeholder: 'search ideas',
        
        onPhraseChangeAction: ({phrase}) => ({
            type: 'search-ideas-for-search-box',
            data: {phrase}
        }),

        onSelectAction: ({suggestion}) => ({
            type: 'animate-graph-viewbox-to-idea',
            data: {ideaId: suggestion.data.ideaId}
        })
    });

}