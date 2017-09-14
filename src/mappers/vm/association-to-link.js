import assert from 'assert';

import Link from 'ui/viewmodels/graph/Link';
import Association from 'domain/models/Association';

/**
 * Maps association model to link view model
 * @param {Association} assoc
 * @return {Link}
 */
export default function associationToLink(assoc) {
    assert(assoc instanceof Association,
        `Object '${assoc}' is not an Association`);

    const link = new Link();

    link.id = assoc.id;
    link.title.value = assoc.value;

    return link;
}