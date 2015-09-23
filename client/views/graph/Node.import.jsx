import DisplayNameAttribute from '../shared/DisplayNameAttribute';
import ViewModelComponent from 'client/views/shared/ViewModelComponent';
import Point from 'client/viewmodels/misc/Point';
import Node from 'client/viewmodels/graph/Node';
import Group from '../svg/Group';
import Circle from '../svg/Circle';
import TextArea from '../svg/TextArea';

export default React.createClassWithCSS({

  displayName: 'Node',

  mixins: [DisplayNameAttribute, ViewModelComponent],

  propTypes: {
    node: React.PropTypes.instanceOf(Node).isRequired
  },

  getViewModel() {
    return {node: this.props.node};
  },

  css: {
    node: {
      'stroke': '#BBB',
      'stroke-width': '1'
    },
    title: {
      'font-size': '20px',
      'color': '#333',
      'text-align': 'center',
      'overflow': 'hidden',
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
    let {node, className, ...other} = this.props;

    let textAreaWidth = 200;
    let textAreaHeight = 25;
    let textAreaPos = new Point();
    textAreaPos.x = -(textAreaWidth / 2);
    textAreaPos.y = -(node.radius + textAreaHeight);

    return (
      <Group pos={ node.pos }>

        <Circle className={ cx(this.css().node, className)}
                style={{fill: node.color || 'lightgray'}}
                radius={ node.radius }
                {...other} />

        <TextArea className={ this.css().title }
                  pos={ textAreaPos }
                  width={ textAreaWidth }
                  height={ textAreaHeight }
                  value={ node.title }
                  editable={ node.titleEditable }
                  onClick={ node.onTitleClick.bind(node) }
                  onBlur={ node.onTitleBlur.bind(node) }
                  onChange={ node.onTitleChange.bind(node) }/>

      </Group>
    );
  }

})