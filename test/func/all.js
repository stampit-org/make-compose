import MakeCompose, {
  mergeComposable, createStamp, createFactory, isComposable, isDescriptor, assign, merge, createObject
}
  from '../..';

const compose = MakeCompose({
  assign(...args) {
    return assign(...args);
  },
  merge(...args) {
    return merge(...args);
  },
  isDescriptor(obj) {
    return isDescriptor(obj);
  },
  isComposable(obj) {
    return isComposable(obj);
  },
  createObject(proto) {
    return createObject(proto);
  },
  mergeComposable(dstDescriptor, srcComposable) {
    return mergeComposable.call(this, dstDescriptor, srcComposable);
  },
  createStamp(descriptor, composeImplementaion) {
    return createStamp.call(this, descriptor, composeImplementaion);
  },
  createFactory(descriptor) {
    return createFactory.call(this, descriptor);
  }
});

var checkCompose = require('check-compose');
checkCompose(compose);
