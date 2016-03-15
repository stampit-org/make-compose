# make-compose
Hackable implementation of the ['compose' specification](https://github.com/stampit-org/stamp-specification)

## Install

```sh
$ npm i make-compose
```

## Usage

```js
import MakeCompose from 'make-compose';
const compose = MakeCompose(options);
```

## API

```js
import MakeCompose from 'make-compose';
const mergeComposable = {MakeCompose};
let descriptorMergeCounter = 0;
const compose = MakeCompose({mergeComposable: function (dstDescriptor, srcDescriptor) {
  console.log(++descriptorMergeCounter);
  return mergeComposable(dstDescriptor, srcDescriptor);
}});
```
