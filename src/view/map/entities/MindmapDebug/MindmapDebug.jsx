import React, { Component } from "react";

import round from "utils/round";
import MindmapVmType from "vm/map/entities/Mindmap";

import classes from "./MindmapDebug.css";

/**
 * @typedef {object} Props
 * @prop {MindmapVmType} mindmap
 *
 * @extends {Component<Props>}
 */
export default class MindmapDebug extends Component {
  render() {
    const { mindmap, mindmap: { viewbox } } = this.props;

    if (!mindmap.debug) {
      return null;
    }

    const focusZoneMax = round(mindmap.debugInfo.focusZoneMax);
    const shadeZoneMax = round(mindmap.debugInfo.shadeZoneMax);

    const lines = [
      [
        "viewbox",
        `(${round(viewbox.x)}; ${round(viewbox.y)}) - ` +
          `(${round(viewbox.width)}; ${round(viewbox.height)})`
      ],

      ["scale", round(viewbox.scale, 2)],
      ["drag", mindmap.drag.active.toString()],
      ["pan", mindmap.pan.active.toString()],

      ["focus center", round(mindmap.debugInfo.focusCenter, 2)],
      ["focus zone", `(Infinity - ${focusZoneMax}]`],
      ["shade zone", `(${focusZoneMax} - ${shadeZoneMax}]`],
      ["hide zone", `(${shadeZoneMax} - Infinity)`]
    ];

    return (
      <div id={"debug"} className={classes.root}>
        {lines.map(line => (
          <div key={line[0]}>
            <span className={classes.title}>{line[0]}:</span>
            <span className={classes.value}>{line[1]}</span>
          </div>
        ))}
      </div>
    );
  }
}
