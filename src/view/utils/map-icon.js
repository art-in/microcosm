import icons from 'font-awesome/css/font-awesome.css';

import Icon from 'vm/shared/Icon';

/**
 * @typedef {object} IconDescriptor
 * @prop {string} class - css class
 * @prop {string} char - unicode char
 */

/**
 * Maps icon type to icon descriptor
 * 
 * @param {Icon} icon
 * @return {IconDescriptor}
 */
export default function mapIcon(icon) {
    if (!descriptors[icon]) {
        throw Error(`Unknown icon type '${icon}'`);
    }

    return descriptors[icon];
}

/**
 * @type {Object<Icon, IconDescriptor>}
 */
const descriptors = {
    [Icon.plusCircle]: {
        class: icons.faPlusCircle,
        char: '\uf055'
    },
    [Icon.paintBrush]: {
        class: icons.faPaintBrush,
        char: '\uf1fc'
    },
    [Icon.link]: {
        class: icons.faLink,
        char: '\uf0c1'
    },
    [Icon.trash]: {
        class: icons.faTrash,
        char: '\uf1f8'
    }
};