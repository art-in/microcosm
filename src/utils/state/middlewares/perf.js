import perf from 'utils/perf';
import Middleware from 'utils/state/Middleware';

const dispatchEmoj = '🚀';
const mutateEmoj = '❗';
const failEmoj = '💥';

/**
 * Creates new instance of performance middleware.
 *
 * Draws measure blocks of dispatch process in 'user timings' section of
 * performance timeline.
 *
 * @return {Middleware} middleware instance
 */
export default () =>
  new Middleware({
    /**
     * Handles new dispatch
     * @param {EventEmitter} events - dispatch events
     */
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
        perf.end(perfMutationIds.get(mutationId), `failed ${failEmoj}`);
        perfMutationIds.delete(mutationId);

        perf.endGroup(perfDispatchId, `failed in mutator ${failEmoj}`);
      });

      events.on('handler-fail', () => {
        perf.endGroup(perfDispatchId, `failed in handler ${failEmoj}`);
      });
    }
  });
