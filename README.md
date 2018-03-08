# WARNING!
This proejct is obsolete. It was substituted with the [composers](https://medium.com/@koresar/fun-with-stamps-episode-11-interfering-composition-7abc44ac1f99) introduced in [stamp specification v1.5](https://github.com/stampit-org/stamp-specification/releases/tag/v1.5.1).

This repository will be archived in early 2018.

# make-compose
Hackable implementation of the ['compose' specification](https://github.com/stampit-org/stamp-specification)

## Install

```sh
$ npm i make-compose
```

## API

The following is written using [rtype](https://github.com/ericelliott/rtype) type notation.

```js
interface Stamp (options?: Object|Any, ...args?: Any[]) => Any; {
  compose: Compose; Descriptor
}

Initializer(options?: object, ?: { stamp: Stamp, instance: Any, args: Any[] }) => instance: Void|Any

ingerface Descriptor {
  methods?: Object,
  properties?: Object,
  deepProperties?: Object,
  propertyDescriptors?: Object,
  staticProperties?: Object,
  staticDeepProperties?: Object,
  staticPropertyDescriptors?: Object,
  configuration?: Object,
  deepConfiguration?: Object,
  initializers?: Initializer[]
}

interface Composable: Stamp|Descriptor

interface Compose (...args?: Composable[]) => Stamp
```

### MakeCompose(options: Object) => compose: Function

This function creates and returns the `compose` implementation. The `options` argument can have the following key-value pairs:
* > `mergeComposable: (dstDescriptor: Descriptor, srcComposable: Composable) => dstDescriptor: Descriptor` - merges (mutates) the second argument into the first argument. Returns the first argument. Supply it to track composition.
* > `createStamp: (descriptor: Descriptor, composeFunction: Compose) => Stamp` - creates new stamp from the given descriptor and the `compose` function. Supply it to track each instantiated stamp.
* > `createFactory: (descriptor: Descriptor) => Function` - creates a factory function from the given descriptor. Supply it to override factory function creation.
* > `createObject: (proto: Object) => Object|Any` - given the prototype object creates a new empty object form it. Default value is `Object.create`. Supply it to tweak the objects the stamp are gonna return. 
* > `assign: (dst: Object, src: Object) => dst: Object` - supply it to override the default `Object.assign` implementation.
* > `merge: (dst: Object, src: Object) => dst: Object` - the stamp-specific merge function. Supply it to override the default implementation. 

### mergeComposable

Use it when you need to track or override each time a composable is merged to the new descriptor object.

```js
import MakeCompose, {mergeComposable} from 'make-compose';
const compose = MakeCompose({
  mergeComposable: function (dstDescriptor, srcComposable) {
    const name = (srcComposable && ((srcComposable.toString && srcComposable.toString()) || srcComposable.name));
    console.log('composing with', name);
    return mergeComposable.call(this, dstDescriptor, srcComposable);
  }
});
```

### createStamp

Use it when you need to track or override each new stamp created.

```js
import MakeCompose, {createStamp} from 'make-compose';
let counter = 0;
const compose = MakeCompose({
  createStamp: function (descriptor) {
    console.log(++counter);
    return createStamp(descriptor);
  }
});
```

### createFactory

Use it when your factory function needs to be different to the default one.

```js
import MakeCompose, {createFactory} from 'make-compose';
let counter = 0;
const compose = MakeCompose({
  createFactory(descriptor) {
    const factory = createFactory.call(this, descriptor);
    const name = (counter++).toString();
    factory.toString = () => ("Object#" + name);
    return factory;
  }
});
```

### createObject

Use it when you need your stamps to instantiate something different to the regular objects. The default algorithm is simply the `Object.create`.

```js
import MakeCompose, {createObject} from 'make-compose';
let counter = 0;
const compose = MakeCompose({
  createObject: function (proto) {
    console.log(++counter);
    return createObject(proto);
  }
});
```

### assign

You can also override the `Object.assign` implementation. But it is used in many various places. Beware!

```js
import MakeCompose, {assign} from 'make-compose';
let counter = 0;
const compose = MakeCompose({
  assign: function (dst, src) {
    console.log(++counter);
    return assign(dst, src);
  }
});
```

### merge

You can also override the stamp-specific deep merge implementation. But it is used in many various places. Beware!

```js
import MakeCompose, {merge} from 'make-compose';
let counter = 0;
const compose = MakeCompose({
  merge: function (dst, src) {
    console.log(++counter);
    return merge(dst, src);
  }
});
```

## Example

All the stamps created from this `compose` functions are going to:
* have new `toString()` method which returns the stamp dummy name
* print the name of the stamp each time it is composed
* count the number of descriptors merged and stamps instantiated

```js
import MakeCompose, {mergeComposable, createStamp, isComposable, isDescriptor}
 from 'make-compose';
const counters = {composedDescriptors: 0, createdStamps: 0};
const compose = MakeCompose({
  mergeComposable(dstDescriptor, srcComposable) {
    if (isComposable(srcComposable)) {
      counters.composedDescriptors++;
      const name = (srcComposable && ((srcComposable.toString && srcComposable.toString()) || srcComposable.name));
      console.log('composing with', name); // Printing the name of the stamp.
    }
    return mergeComposable.call(this, dstDescriptor, srcComposable);
  },
  createStamp(descriptor, composeImplementaion) {
    counters.createdStamps++;
    return createStamp.call(this, descriptor, composeImplementaion);
  },
  createFactory(descriptor) {
    const factory = createFactory.call(this, descriptor);
    const name = counters.createdStamps.toString();
    factory.toString = () => ("Object#" + name); // Overwriting the default JavaScript "toString"
    return factory;
  }
});
```
