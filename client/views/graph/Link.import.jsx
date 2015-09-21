import Link from 'client/viewmodels/graph/Link';
import Point from 'client/viewmodels/misc/Point';
import Group from '../svg/Group';
import Line from '../svg/Line';
import Text from '../svg/Text';

export default React.createClassWithCSS({

  displayName: 'Link',

  propTypes: {
    link: React.PropTypes.instanceOf(Link).isRequired
  },

  css: {
    line: {
      'stroke': 'gray',
      'stroke-width': '2'
    },
    title: {
      'font-size': '24px',
      'fill': '#333',
      '&::selection': {
        // do not select titles of nearby nodes when dragging over
        'background-color': 'inherit'
      }
    }
  },

  render() {
    let {link, className, ...other} = this.props;

    let reverseTitle = link.fromNode.pos.x > link.toNode.pos.x;

    return (
      <Group id={ this.constructor.displayName }>

        <Line id={ link.id }
              className={ cx(this.css().line, className) }
              pos1={ link.fromNode.pos }
              pos2={ link.toNode.pos }
              {...other} />

        <Text text={ link.title }
              href={ link.id }
              pos={ new Point(0, -10) }
              offset={ 30 }
              reverse={ reverseTitle }
              className={ this.css().title } />

      </Group>
    );
  }

})