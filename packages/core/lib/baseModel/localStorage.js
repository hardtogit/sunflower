"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * 对localStorage封装，方便使用
 * ⚠️ 不能存储function类型【本身存储function也没意义】
 */
var storage = window.localStorage;

function serialize(value) {
  return JSON.stringify({
    value: value
  });
}

function deserialize(value) {
  try {
    return JSON.parse(value).value;
  } catch (error) {
    // eslint-disable-next-line
    console.warn("caught an error ".concat(error));
    return value;
  }
}

var wrappedNativeMethods = {
  setItem: function setItem(key, value) {
    storage.setItem(key, serialize(value));
  },
  getItem: function getItem(key) {
    return deserialize(storage.getItem(key));
  },
  removeItem: function removeItem(key) {
    storage.removeItem(key);
  },
  clear: function clear() {
    storage.clear();
  }
};

var _default = function () {
  if (window.Proxy) {
    return new window.Proxy({}, {
      get: function get(target, prop) {
        var result = storage[prop];

        if (typeof result === 'function') {
          var methodName = result.name;
          return wrappedNativeMethods[methodName];
        }

        return deserialize(result);
      },
      set: function set(target, prop, value) {
        storage[prop] = serialize(value);
        return true;
      }
    });
  }

  return wrappedNativeMethods;
}();

exports["default"] = _default;