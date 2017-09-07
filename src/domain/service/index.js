import ideas from './ideas';
import associations from './associations';
import mindmaps from './mindmaps';

import Patch from 'state/Patch';
import Dispatcher from 'state/Dispatcher';

const disp = Dispatcher.combine(ideas, associations, mindmaps);

disp.reg('init', data => new Patch('init', data));

export default disp;