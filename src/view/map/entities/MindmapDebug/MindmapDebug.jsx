import React, {Component} from 'react';

import round from 'utils/round';
import MindmapVmType from 'vm/map/entities/Mindmap';

import classes from './MindmapDebug.css';

/**
 * @typedef {object} Props
 * @prop {MindmapVmType} mindmap
 *
 * @extends {Component<Props>}
 */
export default class MindmapDebug extends Component {
  render() {
    const {
      mindmap,
      mindmap: {viewbox}
    } = this.props;

    if (!mindmap.debug.enable) {
      return null;
    }

    const focusZoneMax = round(mindmap.debug.focusZoneMax);
    const shadeZoneMax = round(mindmap.debug.shadeZoneMax);

    const lines = [
      [
        'viewbox center',
        `(${round(viewbox.center.x)}; ${round(viewbox.center.y)})`
      ],
      [
        'viewbox size',
        `(${round(viewbox.size.width)}; ${round(viewbox.size.height)})`
      ],
      ['', '---'],
      ['scale', round(viewbox.scale, 2)],
      ['drag', mindmap.drag.active.toString()],
      ['pan', mindmap.pan.active.toString()],
      ['', '---'],
      ['focus idea id', mindmap.debug.focusIdeaId.slice(0, 5)],
      ['focus center', round(mindmap.debug.focusCenter, 2)],
      ['focus zone', `(Infinity - ${focusZoneMax}]`],
      ['shade zone', `(${focusZoneMax} - ${shadeZoneMax}]`],
      ['hide zone', `(${shadeZoneMax} - Infinity)`]
    ];

    return (
      <div id={'debug'} className={classes.root}>
        {lines.map((line, idx) => (
          <div key={idx}>
            <span className={classes.title}>
              {line[0] ? `${line[0]}:` : ''}
            </span>
            <span className={classes.value}>{line[1]}</span>
          </div>
        ))}
      </div>
    );
  }
}
