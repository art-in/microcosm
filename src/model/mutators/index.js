const mutators = {};

// dinamicaly register all mutators in current folder
// eslint-disable-next-line no-undef
const context = require.context('.', true, /\.js$/);
context.keys().forEach(modulePath => {
    const module = context(modulePath);
    const type = modulePath.match(/.+\/(.+)\./i)[1];
    if (mutators[type]) {
        throw Error(`Mutation '${type}' already has registered handler`);
    }
    if (type !== 'index') {
        mutators[type] = module.default;
    }
});

/**
 * Applies patch to model state
 * @param {object} state
 * @param {Patch} patch
 */
export default function mutate(state, patch) {
    for (const mutation of patch) {
        if (mutation.hasTarget('model')) {
            const {type, data} = mutation;
            if (!mutators[type]) {
                throw Error(`Unknown mutation '${type}'`);
            }
            mutators[type](state, data);
        }
    }
}