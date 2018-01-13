import React, {Component} from 'react';
import cx from 'classnames';
import icons from 'font-awesome/css/font-awesome.css';

import VersionVmType from 'vm/main/Version';

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

                <span className={cx(
                    classes.icon,
                    icons.fa,
                    icons.faGithubAlt)} />
            </a>
        );
    }

}