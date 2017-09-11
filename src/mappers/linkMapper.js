import assert from 'assert';

import Link from 'ui/viewmodels/graph/Link';
import Association from 'domain/models/Association';

/**
 * Maps association model to link view model
 * @param {Association} assoc
 * @return {Link}
 */
export function assocToLink(assoc) {
    assert(assoc instanceof Association,
        `Object '${assoc}' is not an Association`);

    const link = new Link();

    link.id = assoc.id;
    link.title.value = assoc.value;

    return link;
}

/**
 * Maps link view model to association model
 * @param {Link} link
 * @param {Association} assoc
 * @return {Association}
 */
export function linkToAssoc(link, assoc) {
    assert(link instanceof Link,
        `Object '${link}' is not a Link`);
    assert(assoc instanceof Association,
        `Object '${assoc}' is not an Association`);

    assoc.id = link.id;
    assoc.value = link.title.value;

    return assoc;
}