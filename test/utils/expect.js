import {use, expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiSubset from 'chai-subset';

use(chaiAsPromised);
use(chaiSubset);

export default expect;
