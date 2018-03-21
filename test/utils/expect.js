import {use, expect} from 'chai';

import chaiAsPromised from 'chai-as-promised';
import chaiSubset from 'chai-subset';
import chaiDatetime from 'chai-datetime';

use(chaiAsPromised);
use(chaiSubset);
use(chaiDatetime);

export default expect;
