import assert from 'assert';

import Link from 'vm/map/entities/Link';
import Association from 'model/entities/Association';

/**
 * Maps link view model to association model
 * @param {Link} link
 * @param {Association} assoc
 * @return {Association}
 */
export default function linkToAssociation(link, assoc) {
    assert(link instanceof Link,
        `Object '${link}' is not a Link`);
    assert(assoc instanceof Association,
        `Object '${assoc}' is not an Association`);

    assoc.id = link.id;
    assoc.value = link.title.value;

    return assoc;
}