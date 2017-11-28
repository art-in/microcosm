import required from 'utils/required-params';

/**
 * Inits model state
 * 
 * @param {object}  state 
 * @param {object}  data 
 * @param {PouchDB.Database} data.ideas
 * @param {PouchDB.Database} data.associations
 * @param {PouchDB.Database} data.mindmaps
 */
export default function init(state, data) {
    const {model} = state;
    const {model: {mindmap}} = required(data);

    model.mindmap = mindmap;
}