import Svg from 'client/components/svg/Svg';
import Rect from 'client/components/svg/Rect';

export default React.createClassWithCSS({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      ideas: []
    };
  },

  getMeteorData() {
    this.state.ideas = Ideas.find({}).fetch();
    return {};
  },

  css: {
    component: {
      'font-family': 'Monospace'
    }
  },

  render() {
    return (
      <section className={ this.css().component }>
        <Svg>
          <Rect />
        </Svg>
      </section>
    );
  }
});

