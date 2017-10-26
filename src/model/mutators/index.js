import regMutatorsFolder from 'utils/reg-mutators-folder';

// eslint-disable-next-line no-undef
const context = require.context('.', true, /\.js$/);
const mutators = regMutatorsFolder(context);

/**
 * Applies patch to model state
 * @param {object} state
 * @param {Patch} patch
 */
export default function mutate(state, patch) {
    patch
        .filter(m => m.hasTarget('model'))
        .forEach(m => {
            const {type, data} = m;
            if (!mutators[type]) {
                throw Error(`Unknown mutation '${type}'`);
            }
            mutators[type](state, data);
        });
}