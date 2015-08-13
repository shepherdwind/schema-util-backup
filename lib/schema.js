'use strict';

var parse = require('../parse/schema').parse;
var defaultConfig = require('./types');

function toLowerCase(string) {
  return string.toLowerCase();
}

function schema(str, _types) {
  let supported = defaultConfig.supported;
  if (Array.isArray(_types)) {
    supported = supported.concat(_types);
  }

  let defaultType = defaultConfig.defaultType;
  if (_types && _types.defaultType) {
    defaultType = _types.defaultType;
  }

  let types = {
    defaultType: defaultType,
    supported: new Set(supported.map(toLowerCase))
  };

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

  if (asts.public) {
    json.public = true;
  }

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
      type: getType(path, types)
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
    type = type.toLowerCase();
    if (types.supported.has(type)) {
      ret = type;
      return true;
    }
  });

  return ret || types.defaultType;
}

module.exports = schema;
