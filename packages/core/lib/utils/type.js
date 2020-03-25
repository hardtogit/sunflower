"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Type = void 0;

// 判断是否为字符串
function isString(source) {
  return typeof source === 'string';
} // 判断是否为数组


function isArray(source) {
  return Array.isArray(source);
} // 判断是否为纯对象


function isObject(source) {
  return Object.prototype.toString.call(source) === '[object Object]';
} // 判断是否为函数


function isFunction(source) {
  return typeof source === 'function';
} // 判断是否为数字


function isNumber(source) {
  return typeof source === 'number';
} // 判断是否为整数


function isInt(source) {
  return /^-?[1-9]\d*$/.test(source);
}

function isEmpty(source) {
  return source === undefined || source === null;
} // 判断是否等于null或者undefined


function isNaN(source) {
  return isNaN(source);
}

var Type = {
  isString: isString,
  isArray: isArray,
  isObject: isObject,
  isFunction: isFunction,
  isNumber: isNumber,
  isInt: isInt,
  isEmpty: isEmpty,
  isNaN: isNaN
};
exports.Type = Type;
var _default = Type;
exports["default"] = _default;