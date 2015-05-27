'use strict';

var schema = require('../index').schema;
var walk = require('../index').walk;

describe('walk.test.js', function() {
  it('simple', function() {
    var json = schema(`
      Array(知名品牌店铺) {
        href(店铺连接),
        title(标题),
        img(图片地址): Image,
        amount(优惠金额),
        user(用户): Object {
          name(名字),
          age(年龄)
        }
      }
    `);
    walk(json, function(def, o) {
      if (def === 'array') {
        return [o];
      } else if (def === 'object') {
        return o;
      }

      return def.description;
    })
    .should.eql([{
      href: '店铺连接',
      title: '标题',
      img: '图片地址',
      amount: '优惠金额',
      user: { age: '年龄', name: '名字' }
    }]);
  });

});
