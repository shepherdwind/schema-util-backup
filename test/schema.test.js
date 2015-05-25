'use strict';

var schema = require('../index').schema;

describe('schema.test.js', function() {
  it('simple', function() {
    var json = schema(`
      array(知名品牌店铺) {
        href(店铺连接),
        title(标题),
        img.image(图片地址),
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
    var types = ['number', 'image'];
    var json = schema(`
      array(知名品牌店铺) {
        href(店铺连接),
        title(标题),
        img.image(图片地址),
        amount.number(优惠金额)
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
      object(abc) {
        title(title),
        user.object(user) {
          name(user name),
          age.number(user age)
        }
      }
    `, ['number']);
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
});
