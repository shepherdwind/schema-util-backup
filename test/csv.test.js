'use strict';

var schema = require('../index').schema;
var toCsv = require('../index').csv;

describe('walk.test.js', function() {
  it('simple', function() {
    var json = schema(`
      Array(知名品牌店铺) {
        href(店铺连接),
        title(标题),
        img(图片地址): Image,
        amount(优惠金额)
      }
    `);

    toCsv(json, [{
      href: 'a', title: 'b', img: 2, amount: 3
    }, {
      href: 'b', title: 'c', img: 1, amount: '23'
    }])
    .should
    .eql([
      ['店铺连接', '标题', '图片地址', '优惠金额'],
      ['a', 'b', 2, 3],
      ['b', 'c', 1, '23']
    ]);
  });
});
