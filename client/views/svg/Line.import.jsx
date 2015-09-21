import Point from 'client/viewmodels/misc/Point';

export const reversedPathIdPostfix = '_reversed';

export default React.createClassWithCSS({

  displayName: 'Line',

  propTypes: {
    id: React.PropTypes.string,
    pos1: React.PropTypes.instanceOf(Point).isRequired,
    pos2: React.PropTypes.instanceOf(Point).isRequired
  },

  render() {
    let {id, pos1, pos2, className, ...other} = this.props;

    id = id || Math.random();

    // React does not (want to?) support namespaced attributes...
    // In 0.14 we will use 'xlinkHref' and for now go with 'dangerouslySetInnerHTML'
    // https://github.com/facebook/react/issues/2250

    // Create two paths: normal one for drawing line itself,
    // and reversed - for later use (e.g. inverted textPath).
    return (
      <g id={ this.constructor.displayName } dangerouslySetInnerHTML={{__html: `

        <defs>
          <path id='${id}'
                class='${className}'
                d='M ${pos1.x} ${pos1.y} L ${pos2.x} ${pos2.y}' />

          <path id='${id}${reversedPathIdPostfix}'
                class='${className}'
                d='M ${pos2.x} ${pos2.y} L ${pos1.x} ${pos1.y}' />
        </defs>
        <use xlink:href='#${id}' />`}} />
    );
  }

})