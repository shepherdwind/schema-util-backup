'use strict';
var walk = require('./walk');

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
  Object.keys(header).map(function(key) {
    row[header[key]] = key;
  });

  var keys = data[0].map(function(desc) {
    return row[desc];
  });

  return data.slice(1).map(function(item) {
    var ret = {};
    item.map(function(val, i) {
      ret[keys[i]] = val;
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
