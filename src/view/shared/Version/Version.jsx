import React, {Component} from 'react';
import cx from 'classnames';
import icons from 'font-awesome/css/font-awesome.css';

// TODO: move version to runtime config
// @ts-ignore json import
import packageConfig from '../../../../package.json';

import classes from './Version.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * 
 * @extends {Component<Props>}
 */
export default class Version extends Component {

    render() {
        const {className} = this.props;

        return (
            <a className={cx(classes.root, className)}
                target={'_blank'} href={packageConfig.homepage}>

                {packageConfig.name} v{packageConfig.version}

                <span className={cx(
                    classes.icon,
                    icons.fa,
                    icons.faGithubAlt)} />
            </a>
        );
    }

}