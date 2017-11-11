import Patch from 'utils/state/Patch';
import diffRootPaths from 'utils/graph/diff-root-paths';

/**
 * Calculates diff between calculated root paths and current graph state
 * and generates patch to fix that diff
 * 
 * @param {object} opts
 * @return {Patch} patch
 */
export default function getRootPathsPatch(opts) {
    const patch = new Patch();

    const rootPathData = diffRootPaths(opts);

    rootPathData.forEach(data => {
        const idea = data.node;
        delete data.node;

        patch.push('update-idea', {
            id: idea.id,
            ...data
        });
    });

    return patch;
}