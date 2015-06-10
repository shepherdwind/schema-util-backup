'use strict';

var schema = require('../index').schema;
var toCsv = require('../index').csv;
var read = toCsv.read;

describe('walk.test.js', function() {
  var json = schema(`
    Array(知名品牌店铺) {
      href(店铺连接),
      title(标题),
      img(图片地址): Image,
      amount(优惠金额)
    }
  `);
  it('simple', function() {

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

  it('read', function() {

    var csv = [
      ['店铺连接', '标题', '图片地址', '优惠金额'],
      ['a', 'b', 2, 3],
      ['b', 'c', 1, '23']
    ];

    read(json, csv)
    .should
    .eql([{
      href: 'a', title: 'b', img: 2, amount: 3
    }, {
      href: 'b', title: 'c', img: 1, amount: '23'
    }]);
  });

  it('read order change', function() {
    var csv = [
      ['优惠金额', '标题', '图片地址', '店铺连接'],
      ['a', 'b', 2, 3],
      ['b', 'c', 1, '23']
    ];

    read(json, csv)
    .should
    .eql([{
      amount: 'a', title: 'b', img: 2, href: 3
    }, {
      amount: 'b', title: 'c', img: 1, href: '23'
    }]);
  });
});
