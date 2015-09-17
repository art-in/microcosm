import Svg from 'client/views/svg/Svg';

export default React.createClassWithCSS({

  css: {
    container: {
      outline: '1px solid red',
      width: '100%',
      height: '500px'
    }
  },

  render() {

    let {className, ...other} = this.props;

    return (
      <Svg className={ cx(this.css().container, className) }
           {...other} >

        { this.props.children }

      </Svg>
    );
  }

});