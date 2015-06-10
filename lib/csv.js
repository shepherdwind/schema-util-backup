'use strict';
var walk = require('./walk');
var fmt = require('util').format;

function csv(json, data) {
  var header = getHeader(json);

  var rows = [];
  if (!Array.isArray(header)) {
    throw new Error('Only array type supported');
  }

  var keys = Object.keys(data[0]);
  rows.push(keys.map(getKey.bind(null, header[0])));
  data.map(function(item) {
    rows.push(keys.map(getKey.bind(null, item)));
  });
  return rows;
}

csv.read = function(json, data) {
  var header = getHeader(json);
  if (!Array.isArray(header)) {
    throw new Error('schema must define an array type');
  }
  header = header[0];
  var row = {};
  var isMatch = false;

  Object.keys(header).map(function(key) {
    row[header[key]] = key;
  });

  // 如果schema定义的所有值在data[0]里都能找到，符合数据描述
  isMatch = Object.keys(row).every(function(key) {
    return data[0].indexOf(key) > -1;
  });

  if (!isMatch) {
    // 如果数据里面的每个key都符合header描述
    isMatch = data[0].every(function(desc) {
      return row[desc] !== undefined;
    });
  }

  if (!isMatch) {
    throw Error(fmt('data not match, header should be %s, get %s',
        Object.keys(row), data[0]));
  }

  var keys = data[0].map(function(desc) {
    return row[desc];
  });

  return data.slice(1).map(function(item) {
    var ret = {};
    item.map(function(val, i) {
      if (keys[i] !== undefined) {
        ret[keys[i]] = val;
      }
    });
    return ret;
  });
};


function getHeader(json) {
  var header = walk(json, function(def, o) {
    if (def === 'array') {
      return [o];
    } else if (def === 'object') {
      return o;
    }

    return def.description;
  });
  return header;
}

function getKey(o, key) {
  return o[key];
}

module.exports = csv;
