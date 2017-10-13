/**
 * 
 */
function patchView(mutationType, mutationData) {
    return new Patch({
        type: mutationType,
        data: mutationData,
        targets: ['vm', 'view']
    });
}