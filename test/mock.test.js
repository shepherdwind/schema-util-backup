'use strict';

var schema = require('../index').schema;
var mock = require('../index').mock;

describe('mock.test.js', function() {
  var json = schema(`
    Array(知名品牌店铺) {
      href(店铺连接),
      title(标题),
      img(图片地址): Image,
      amount(优惠金额),
      user(用户): Object {
        name(名字),
        age(年龄): Number
      }
    }
  `, ['number']);
  it('simple', function() {
    var data = mock(json);
    data.length.should.equal(2);
    data[0].should.eql({
      href: '店铺连接',
      title: '标题',
      img: '图片地址',
      amount: '优惠金额',
      user: { name: '名字', age: 30 }
    });
  });

  it('self define type', function() {
    var img = 'http://image/mock.jpg';
    var data = mock(json, {
      image: img
    });
    data[0].img.should.eql(img);
  });

  it('method support', function() {
    var img = 'http://image/mock.jpg';
    var data = mock(json, {
      image: function() {
        return img;
      }
    });
    data[0].img.should.eql(img);
  });

  it('method support with number', function() {
    var img = 'http://image/mock.jpg';
    var data = mock(json, {
      image: function() {
        return img;
      },
      number: 10
    });
    data[0].img.should.eql(img);
    data[0].user.age.should.eql(10);
  });

  it('array size support', function() {
    var data = mock(json, {
      array: { size: 4 }
    });
    data.length.should.equal(4);
  });

  it('mock other type', function() {
    const s = schema(`
      Object(foo) {
        foo1(hello): boolean,
        foo2(hello2): url,
        foo3(hello3): number
      }
    `);
    const data = mock(s);
    data.should.containEql({ foo1: false, foo2: 'http://alipay.com', foo3: 30 });
  });

});
