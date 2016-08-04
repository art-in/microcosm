import React from 'react';
import cx from 'classnames';

import {createClassWithCSS} from 'client/lib/helpers/reactHelpers';

import DisplayNameAttribute from '../shared/DisplayNameAttribute';
import ViewModelComponent from 'client/views/shared/ViewModelComponent';
import Link from 'client/viewmodels/graph/Link';
import Point from 'client/viewmodels/misc/Point';
import Group from '../svg/Group';
import Line from '../svg/Line';
import Text from '../svg/Text';
import TextArea from '../svg/TextArea';

export default createClassWithCSS({

  displayName: 'Link',

  mixins: [DisplayNameAttribute, ViewModelComponent],

  propTypes: {
    link: React.PropTypes.instanceOf(Link).isRequired
  },

  getViewModel() {
    return {link: this.props.link};
  },

  css: {
    line: {
      'stroke': '#BBB',
      'stroke-width': '1'
    },
    title: {
      'font-size': '20px',
      'color': '#333',
      'overflow': 'hidden',
      'word-break': 'break-all',
      'text-align': 'center',
      'line-height': '25px',
      '&::selection:not([contenteditable])': {
        // do not select titles of nearby nodes when dragging over
        'background-color': 'inherit'
      },
      '&[contenteditable]': {
        'outline': '1px solid red'
      }
    }
  },

  render() {
    let {link, className, ...other} = this.props;

    let titlePartOfLink = 0.75;
    let titleHeight = 25;
    let linkStartWidth = link.isBOI ? 30 : 5;
    let linkEndWidth = 2;

    // Using editable/rectangular TextArea for now.
    // It is always rectangular form, which is OK since all links are lines now.
    // It cannot be drawn on (curl) paths, so compute all positioning stuff by hand.
    // This will not be required when we implement editable text area which can be
    // drawn on (curl) paths.
    // For now it is just easier to compute positions vs. implement curl editable field.
    let {sin, cos, atan2, sqrt, pow, max, PI} = Math;

    // flip title so it always above the link
    let reverseTitle = link.fromNode.pos.x > link.toNode.pos.x;

    let {posFrom, posTo} = {
      posFrom: reverseTitle ? link.toNode.pos : link.fromNode.pos,
      posTo: reverseTitle ? link.fromNode.pos : link.toNode.pos
    };

    let dx = posTo.x - posFrom.x;
    let dy = posTo.y - posFrom.y;
    let linkLength = sqrt(pow(dx, 2) + pow(dy, 2));

    // rotate title with the link
    let titleRotation = atan2(dy, dx) * 180 / PI;
    let titleWidth = linkLength * titlePartOfLink;
    let titlePos = new Point(posFrom.x, posFrom.y);

    // shift title to the center of the link
    titlePos.x += dx * (1 - titlePartOfLink) / 2;
    titlePos.y += dy * (1 - titlePartOfLink) / 2;

    // lift title above the link
    let titleLiftHeight = titleHeight + max(linkStartWidth, linkEndWidth) / 2;

    titlePos.x -= (-sin(titleRotation * (PI / 180)) * titleLiftHeight);
    titlePos.y -= (cos(titleRotation * (PI / 180)) * titleLiftHeight);

    return (
      <Group>

        <Line id={ link.id }
              className={ cx(this.css().line, className) }
              style={{fill: link.color || 'lightgray'}}
              pos1={ link.fromNode.pos }
              pos2={ link.toNode.pos }
              width={{start: linkStartWidth, end: linkEndWidth}}
              {...other} />

        {
          link.title.visible &&
            <TextArea className={ this.css().title }
                      pos={ titlePos }
                      width={ titleWidth }
                      height={ titleHeight }
                      rotation={ titleRotation }
                      value={ link.title.value }
                      editable={ link.title.editing }
                      onClick={ link.onTitleClick.bind(link) }
                      onBlur={ link.onTitleBlur.bind(link) }
                      onChange={ link.onTitleChange.bind(link) }/>
        }

      </Group>
    );
  }

})