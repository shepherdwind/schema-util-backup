'use strict';

var parse = require('../parse/schema').parse;
var defaultConfig = require('./types');
var assign = require('object-assign');

function schema(str, types) {
  if (Array.isArray(types)) {
    types = assign({}, defaultConfig, { supported: types });
  }

  types = types || defaultConfig;
  var asts = parse(str);
  var json = {
    type: asts.type,
    description: asts.description,
    properties: property(asts.props, types)
  };

  return json;
}

function property(props, types) {
  var properties = {};
  props.map(function(prop) {
    var path = prop.path;
    var key = path[0];

    if (prop.type) {
      properties[key] = {
        type: prop.type,
        description: prop.description,
        properties: property(prop.props, types)
      };
      return;
    }

    properties[key] = {
      description: prop.description,
      type: getType(path.slice(1), types)
    };
  });
  return properties;
}

function getType(path, types) {
  if (!path.length) {
    return types.defaultType;
  }

  var ret = null;
  path.some(function(type) {
    if (types.supported.indexOf(type) > -1) {
      ret = type;
      return true;
    }
  });

  return ret || types.defaultType;
}

module.exports = schema;
