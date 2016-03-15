import mergeWith from 'lodash/mergeWith';
import assign from 'lodash/assign';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';

const isDescriptor = isObject;
const merge = (dst, src) => mergeWith(dst, src, (dstValue, srcValue) => {
  if (Array.isArray(dstValue)) {
    if (Array.isArray(srcValue)) return dstValue.concat(srcValue);
    if (isObject(srcValue)) return merge({}, srcValue);
  }
});

function createFactory(descriptor) {
  return function Stamp(options, ...args) {
    let obj = Object.create(descriptor.methods || {});

    merge(obj, descriptor.deepProperties);
    assign(obj, descriptor.properties);
    Object.defineProperties(obj, descriptor.propertyDescriptors || {});

    if (!descriptor.initializers || descriptor.initializers.length === 0) return obj;

    return descriptor.initializers.reduce((resultingObj, initializer) => {
      const returnedValue = initializer.call(resultingObj, options,
        {instance: resultingObj, stamp: Stamp, args: [options].concat(args)});
      return returnedValue === undefined ? resultingObj : returnedValue;
    }, obj);
  };
}

function createStamp(descriptor, composeFunction) {
  const Stamp = createFactory(descriptor);

  merge(Stamp, descriptor.staticDeepProperties);
  assign(Stamp, descriptor.staticProperties);
  Object.defineProperties(Stamp, descriptor.staticPropertyDescriptors || {});

  const composeImplementation = isFunction(Stamp.compose) ? Stamp.compose : composeFunction;
  Stamp.compose = function () {
    return composeImplementation.apply(this, arguments);
  };
  assign(Stamp.compose, descriptor);

  return Stamp;
}

function mergeComposable(dstDescriptor, srcComposable) {
  const srcDescriptor = (srcComposable && srcComposable.compose) || srcComposable;
  if (!isDescriptor(srcDescriptor)) return dstDescriptor;

  const combineProperty = (propName, action) => {
    if (!isObject(srcDescriptor[propName])) return;
    if (!isObject(dstDescriptor[propName])) dstDescriptor[propName] = {};
    action(dstDescriptor[propName], srcDescriptor[propName]);
  };

  combineProperty('methods', assign);
  combineProperty('properties', assign);
  combineProperty('deepProperties', merge);
  combineProperty('propertyDescriptors', assign);
  combineProperty('staticProperties', assign);
  combineProperty('staticDeepProperties', merge);
  combineProperty('staticPropertyDescriptors', assign);
  combineProperty('configuration', assign);
  combineProperty('deepConfiguration', merge);
  if (Array.isArray(srcDescriptor.initializers)) {
    if (!Array.isArray(dstDescriptor.initializers)) dstDescriptor.initializers = [];
    dstDescriptor.initializers.push.apply(dstDescriptor.initializers, srcDescriptor.initializers.filter(isFunction));
  }

  return dstDescriptor;
}

export default function compose(...composables) {
  const descriptor = [this].concat(composables).reduce(mergeComposable, {});
  return createStamp(descriptor, compose);
}
