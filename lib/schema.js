'use strict';

var parse = require('../parse/schema').parse;
var defaultConfig = require('./types');
var assign = require('object-assign');

function schema(str, types) {
  if (Array.isArray(types)) {
    types = assign({}, defaultConfig, {
      supported: types.concat(defaultConfig.supported)
    });
  }

  types = types || defaultConfig;
  var asts = parse(str);
  var json = {};
  if (Array.isArray(asts)) {
    asts.forEach(function(ast) {
      json[ast.key] = createSchema(ast.schema, types);
    });
  } else {
    json = createSchema(asts, types);
  }

  return json;
}

function createSchema(asts, types) {
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
    var key = prop.key;

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
      type: getType(path, types).toLowerCase()
    };
  });
  return properties;
}

function getType(path, types) {
  if (!path || !path.length) {
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
