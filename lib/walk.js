/**!
 * walk schema
 * Copyright(c) Alibaba Group Holding Limited.
 * MIT Licensed
 *
 * Authors:
 *   翰文 <hanwen.sah@taobao.com> (http://shepherdwind.com)
 */

/**
 * walk schema every property
 * @param {object} schema json schema object
 * @param {function} fn method for run
 * @return {object}
 */
module.exports = function walk(schema, fn) {
  if (typeof fn !== 'function') {
    throw new Error('fn must be function');
  }

  var ret = {};
  var type = schema.type;
  if (type === 'object' || type === 'array') {
    Object.keys(schema.properties).forEach(function(prop) {
      ret[prop] = walk(schema.properties[prop], fn);
    });
    return fn(type, ret);
  }

  return fn(schema);
};
