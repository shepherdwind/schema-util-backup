## schema util

[![Build Status](https://travis-ci.org/shepherdwind/schema-util.svg?branch=master)](https://travis-ci.org/shepherdwind/schema-util)

### schema dsl parse

```js
var schema = require('schema-util').schema;

var json = schema(`
  array(foo) {
    href(href),
    title(title),
    img.image(image url),
    amount(money amout)
  }
`);
// json should be so:
/**
  {
    type: 'array',
    description: 'foo',
    properties: {
      href: { description: 'href', type: 'string' },
      title: { description: 'title', type: 'string' },
      img: { description: 'image url', type: 'image' },
      amount: { description: 'money amount', type: 'string' }
    }
  }
*/
```

And nest rule supported:

```
var json = schema(`
  object(abc) {
    title(title),
    user.object(user) {
      name(user name),
      age.number(user age)
    }
  }
`, ['number']);
```

The secend argument, you can add some more type support, such as
`age.number`, `background.color`.

```
schema(`array(foo) { a(a)}`, types)
```

The defaultType is 'string', If you want change this, you need send
the secend argument like this:

```
schema(`array(foo) { a(a)}`, {
  defaultType: 'number',
  supported: ['string']
});
```

#### export support

Write code like this example, you can get a object, which have to
properties a and b. Each property have the value of schema object.

```
schema(`
  export a {
    Object(hello) { ... }
  }

  export b {
    Array(hello b) { ... }
  }
`);
```

### mock

mock schema data

```
mock(schema, config)
```

config can set default type value, for example, config set to { image: 'xx.png' },
then schema mock image type value will be xx.png.

config value can be an function.

### walk

walk every property of schema.
