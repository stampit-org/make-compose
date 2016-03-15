var assert = require('assert');

var MakeCompose = require('..');
var mergeComposable = MakeCompose.mergeComposable;
var descriptorMergeCounter = 0;
const compose = MakeCompose({mergeComposable: function (dstDescriptor, srcDescriptor) {
  console.log(++descriptorMergeCounter);
  return mergeComposable(dstDescriptor, srcDescriptor);
}});

compose().compose();

assert.equal(descriptorMergeCounter, 2);
