import Patch from 'utils/state/Patch';

/**
 * Merges multiple mutations to same entity into single mutation
 * 
 * @param {Patch} patch
 * @return {Patch}
 */
export default function normalizePatch(patch) {
    
    const mutations = [...patch];

    const normalizedMutations = [];

    mutations.forEach(mutation => {
        const comparer = rules[mutation.type];
        if (comparer) {
            const dup = normalizedMutations.find(m =>
                m.type === mutation.type && comparer(m, mutation));
            
            if (dup) {
                Object.assign(dup.data, mutation.data);
            } else {
                normalizedMutations.push(mutation);
            }
        } else {
            normalizedMutations.push(mutation);
        }
    });

    return new Patch(normalizedMutations);
}

// rules of how to find mutations to same entities
const rules = {
    ['update-idea']: (m1, m2) => m1.data.id === m2.data.id,
    ['update-association']: (m1, m2) => m1.data.id === m2.data.id,
    ['update-mindmap']: (m1, m2) => true
};