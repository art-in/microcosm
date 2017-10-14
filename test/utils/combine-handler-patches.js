import Patch from 'src/utils/state/Patch';

/**
 * Combines all patches produced by action handler into one patch
 * (intermediate patches + resulting patch)
 * 
 * @param {function} mutateSpy - mutate spy for intermediate patches
 * @param {Patch}    resPatch  - resulting patch
 * @return {Patch}
 */
export default function(mutateSpy, resPatch) {
    const intermediatePatches = mutateSpy.getCalls().map(c => c.args[0]);
    return Patch.combine(intermediatePatches, resPatch);
}