import Patch from "src/utils/state/Patch";
import MutationType from "src/utils/state/Mutation";

/**
 * Combines all patches produced by action handler into one patch
 * (intermediate patches + resulting patch)
 *
 * @param {sinon.SinonSpy} mutateSpy - mutate spy for intermediate patches
 * @param {Patch} resPatch - resulting patch
 * @return {Patch}
 */
export default function combineHandlerPatches(mutateSpy, resPatch) {
  /** @type {Array.<Patch>} */
  const intermediatePatches = mutateSpy.getCalls().map(c => c.args[0]);
  return Patch.combine(intermediatePatches, resPatch);
}
