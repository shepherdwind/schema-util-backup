/**
 * mock json schema data
 */
var assign = require('object-assign');
var walk = require('./walk');
var defaultConfig = {
  array: { size: 2 }
};

module.exports = function mock(schema, config) {
  config = assign({}, defaultConfig, config);
  return walk(schema, function(type, data) {
    if (typeof type === 'string') {
      if (type === 'array') {
        var len = config.array.size || 1;
        var ret = [];
        for (var i = 0; i < len; i++) {
          ret.push(data);
        }
        return ret;
      }

      return data;
    }

    var val = config[type.type];
    if (typeof val === 'function') {
      return val(type);
    }

    return val === undefined ?
      type.description : val;
  });
};
