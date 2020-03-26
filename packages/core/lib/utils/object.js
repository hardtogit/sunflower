"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pick = pick;
exports.extend = extend;
exports.toArray = toArray;
exports.toFormData = toFormData;
exports.isNotEmpty = isNotEmpty;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 返回一个object副本，只过滤出keys参数指定的属性值
function pick(obj, keys) {
  return keys.reduce(function (res, k) {
    return k in obj ? _objectSpread({}, res, _defineProperty({}, k, obj[k])) : res;
  }, {});
} // extend，与assign的区别在于不会继承undefined属性


function extend() {
  var dest = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var result = _objectSpread({}, dest);

  Object.keys(source).forEach(function (key) {
    if (source[key] !== undefined) {
      result[key] = source[key];
    }
  });
  return result;
} // 将对象转换为数组


function toArray(obj, keyId, valueId) {
  return Object.keys(obj).reduce(function (arr, key) {
    var _arr$concat;

    return arr.concat((_arr$concat = {}, _defineProperty(_arr$concat, keyId, key), _defineProperty(_arr$concat, valueId, obj[key]), _arr$concat));
  }, []);
} // 把对象转换为FormData


function toFormData(originData) {
  if (!originData) return null;
  var fd = new window.FormData();

  function transformToFormData(formData, data, parentKey) {
    if (data && _typeof(data) === 'object' && !(data instanceof Date) && !(window.File && data instanceof window.File)) {
      Object.keys(data).forEach(function (key) {
        var tempKey;

        if (Array.isArray(data)) {
          tempKey = parentKey ? "".concat(parentKey, "[").concat(key, "]") : key;
        } else {
          tempKey = parentKey ? "".concat(parentKey, ".").concat(key) : key;
        }

        transformToFormData(formData, data[key], tempKey);
      });
    } else {
      var value = data === null ? '' : data;
      formData.append(parentKey, value);
    }
  }

  transformToFormData(fd, originData);
  return fd;
}

function isNotEmpty(obj) {
  return obj !== null && obj !== undefined;
}