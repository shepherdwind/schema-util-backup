'use strict';

var schema = require('../index').schema;

describe('schema.test.js', function() {
  it('simple', function() {
    var json = schema(`
      Array(知名品牌店铺) {
        href(店铺连接),
        title(标题),
        img(图片地址): Image,
        amount(优惠金额)
      }
    `);
    json.type.should.eql('array');
    json.description.should.eql('知名品牌店铺');
    var props = {
      href: { description: '店铺连接', type: 'string' },
      title: { description: '标题', type: 'string' },
      img: { description: '图片地址', type: 'image' },
      amount: { description: '优惠金额', type: 'string' }
    };

    json.properties.should.eql(props);
  });

  it('add other types support', function() {
    var types = ['Number', 'Image'];
    var json = schema(`
      Array(知名品牌店铺) {
        href(店铺连接),
        title(标题),
        img(图片地址): Image,
        amount(优惠金额): Number
      }
    `, types);

    var props = {
      href: { description: '店铺连接', type: 'string' },
      title: { description: '标题', type: 'string' },
      img: { description: '图片地址', type: 'image' },
      amount: { description: '优惠金额', type: 'number' }
    };

    json.properties.should.eql(props);
  });

  it('nest rules', function() {
    var json = schema(`
      Object(abc) {
        title(title),
        user(user): Object {
          name(user name),
          age(user age): Number
        }
      }
    `, ['Number']);
    var props = {
      title: { description: 'title', type: 'string' },
      user: {
        type: 'object',
        description: 'user',
        properties: {
          name: { description: 'user name', type: 'string' },
          age: { description: 'user age', type: 'number' }
        }
      }
    };
    json.properties.should.eql(props);
  });

  it('export support', function() {
    var json = schema(`
      export a {
        Object(hello) {
          url(href)
        }
      }

      export b {
        Array(hello b) {
          url(href),
          c(d)
        }
      }
    `);

    json.a.type.should.equal('object');
    json.b.type.should.equal('array');
    json.b.properties.should.eql({
      url: {
        description: 'href',
        type: 'string'
      },
      c: {
        description: 'd',
        type: 'string'
      }
    });
  });
});
