import assert from 'utils/assert';

import Link from 'vm/map/entities/Link';
import Association from 'model/entities/Association';

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