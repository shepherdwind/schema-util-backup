'use strict';
var walk = require('./walk');

module.exports = function(json, data) {
  var header = walk(json, function(def, o) {
    if (def === 'array') {
      return [o];
    } else if (def === 'object') {
      return o;
    }

    return def.description;
  });

  var rows = [];
  if (Array.isArray(header)) {
    var keys = Object.keys(data[0]);
    rows.push(keys.map(getKey.bind(null, header[0])));
    data.map(function(item) {
      rows.push(keys.map(getKey.bind(null, item)));
    });
  }

  return rows;
};

function getKey(o, key) {
  return o[key];
}
