import assert from 'assert';

import MakeCompose, {mergeComposable} from '../..';

let descriptorMergeCounter = 0;
const compose = MakeCompose({
  mergeComposable(dstDescriptor, srcComposable) {
    ++descriptorMergeCounter;
    return mergeComposable(dstDescriptor, srcComposable);
  }
});

compose(compose().compose());
//-----^---------^-----------
//-----2---------1-----------
// That's where descriptor merging happens.

assert.equal(descriptorMergeCounter, 2);
