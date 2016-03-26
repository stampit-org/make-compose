import MakeCompose, {mergeComposable, createStamp, createFactory} from '../';
const counters = {composedDescriptors: 0, createdStamps: 0};
const compose = MakeCompose({
  mergeComposable(dstDescriptor, srcComposable) {
    counters.composedDescriptors++;
    const name = (srcComposable && ((srcComposable.toString && srcComposable.toString()) || srcComposable.name));
    console.log('composing with', name);
    return mergeComposable.call(this, dstDescriptor, srcComposable);
  },
  createStamp(descriptor, composeImplementaion) {
    counters.createdStamps++;
    return createStamp.call(this, descriptor, composeImplementaion);
  },
  createFactory(descriptor) {
    const factory = createFactory.call(this, descriptor);
    const name = counters.createdStamps.toString();
    factory.toString = () => ("Object#" + name);
    return factory;
  }
});

const Stamp1 = compose();
const Stamp2 = compose(Stamp1);
const Stamp3 = Stamp1.compose();
const Stamp4 = Stamp1.compose(Stamp2, Stamp3);
console.log(`Number of created stamps`, counters.createdStamps);
console.log('New name 1:', Stamp1.toString());
console.log('New name 2:', Stamp2.toString());
console.log('New name 3:', Stamp3.toString());
console.log('New name 4:', Stamp4.toString());

// Test this file with: $ check-compose examples/all.js
export default compose;
