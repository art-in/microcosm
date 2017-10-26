import perf from 'utils/perf';

const dispatchEmoj = '🚀';
const mutateEmoj = '❗';

/**
 * Creates new instance of performance middleware.
 * 
 * Draws measure blocks of dispatch process
 * in 'user timings' section of performance timeline.
 * 
 * @param {EventEmitter} events - dispatch events
 * @return {object} middleware instance
 */
export default () => ({

    onDispatch(events) {

        let perfDispatchId;

        // dictionary
        // key   - mutation id
        // value - performance measure id
        const perfMutationIds = new Map();
    
        events.on('before-dispatch', ({action}) => {
            const dispatchLabel = `${dispatchEmoj} ${action.type}`;
            perfDispatchId = perf.startGroup(dispatchLabel);
        });
    
        events.on('after-dispatch', () => {
            perf.endGroup(perfDispatchId);
        });
    
        events.on('before-mutation', ({mutationId, patch}) => {
            const mutations = patch.map(m => m.type).join(', ');
            const mutationLabel = `${mutateEmoj} ${mutations}`;
            const perfId = perf.start(mutationLabel, perfDispatchId);

            perfMutationIds.set(mutationId, perfId);
        });
    
        events.on('after-mutation', ({mutationId}) => {
            perf.end(perfMutationIds.get(mutationId));
            perfMutationIds.delete(mutationId);
        });
    
        events.on('mutation-fail', ({mutationId}) => {
            // TODO: mark failed measure
            perf.end(perfMutationIds.get(mutationId));
            perfMutationIds.delete(mutationId);

            // TODO: mark failed group
            perf.endGroup(perfDispatchId);
        });
    
        events.on('handler-fail', () => {
            // TODO: mark failed group
            perf.endGroup(perfDispatchId);
        });
    }

});