import MakeCompose, {
  mergeComposable, createStamp, createFactory, isComposable, isDescriptor, assign, merge, createObject
}
  from '../..';
import assert from 'assert';

const calls = {createObject: 0, mergeComposable: 0, createStamp: 0, createFactory: 0};
const used = {};
const compose = MakeCompose({
  // utility functions
  assign(...args) {
    used.assign = true;
    return assign(...args);
  },
  merge(...args) {
    used.merge = true;
    return merge(...args);
  },
  isComposable(obj) {
    used.isComposable = true;
    return isComposable(obj);
  },
  isDescriptor(obj) {
    used.isDescriptor = true;
    return isDescriptor(obj);
  },

  // main logic functions
  createObject(proto) {
    calls.createObject++;
    return createObject(proto);
  },
  mergeComposable(dstDescriptor, srcComposable) {
    calls.mergeComposable++;
    return mergeComposable.call(this, dstDescriptor, srcComposable);
  },
  createStamp(descriptor, composeImplementaion) {
    calls.createStamp++;
    return createStamp.call(this, descriptor, composeImplementaion);
  },
  createFactory(descriptor) {
    calls.createFactory++;
    return createFactory.call(this, descriptor);
  }
});

compose({})();

assert.deepEqual(used, {assign: true, merge: true, isDescriptor: true, isComposable: true});
assert.deepEqual(calls, {createObject: 1, mergeComposable: 1, createStamp: 1, createFactory: 1});
