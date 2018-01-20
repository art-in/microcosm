import React, {Component} from 'react';
import cx from 'classnames';

import VersionVmType from 'vm/main/Version';
import IconType from 'vm/shared/Icon';

import Icon from 'view/shared/Icon';

import classes from './Version.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {VersionVmType} version
 * 
 * @extends {Component<Props>}
 */
export default class Version extends Component {

    render() {
        const {className, version: vm} = this.props;
        const {name, homepage, version} = vm;

        return (
            <a className={cx(classes.root, className)}
                target={'_blank'} href={homepage}>

                {name} v{version}

                <Icon className={classes.icon}
                    icon={IconType.githubAlt} />
            </a>
        );
    }

}