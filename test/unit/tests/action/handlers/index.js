describe('handlers', () => {
    // TODO: dinamicaly require test files everywhere
    const context = require.context('.', false, /\.test\.js$/);
    context.keys().forEach(key => context(key));
});