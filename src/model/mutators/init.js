import required from 'utils/required-params';

/**
 * Inits model state
 * 
 * @param {object}  state 
 * @param {object}  data 
 * @param {PouchDB} data.ideas
 * @param {PouchDB} data.associations
 * @param {PouchDB} data.mindmaps
 */
export default function init(state, data) {
    const {model} = state;
    const {model: {mindmap}} = required(data);

    model.mindmap = mindmap;
}