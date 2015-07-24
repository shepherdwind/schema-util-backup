'use strict';
var walk = require('./walk');

function csv(json, data) {
  var header = getHeader(json);

  var rows = [];
  if (!Array.isArray(header)) {
    throw new Error('Only array type supported');
  }
  header = header[0];

  var keys = Object.keys(header);
  rows.push(keys.map(getKey.bind(null, header)));

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
  var headerKeys = Object.keys(header);

  headerKeys.map(function(key) {
    row[header[key]] = key;
  });

  var keys = data[0].map(function(desc) {
    if (row[desc]) {
      return row[desc];
    }
  });

  var misskeys = headerKeys.filter(function(o) {
    return keys.indexOf(o) === -1;
  }) || [];

  return data.slice(1).map(function(item) {
    var ret = {};
    item.map(function(val, i) {
      if (keys[i] !== undefined) {
        ret[keys[i]] = val;
      }
    });

    misskeys.map(function(key) {
      ret[key] = '';
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
  return o[key] || '';
}

module.exports = csv;
