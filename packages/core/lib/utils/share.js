"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatDate = formatDate;
exports.queryURL = queryURL;
exports.queryArray = queryArray;
exports.getRealArray = getRealArray;
exports.queryDeepArray = queryDeepArray;
exports.isObject = isObject;
exports.looseEqual = looseEqual;
exports.createUUID = createUUID;
exports.urlStrToObj = urlStrToObj;
exports.objToUrlStr = objToUrlStr;
exports.deepTrim = deepTrim;
exports.dataToTreeV2 = dataToTreeV2;
exports.convert = convert;
exports.openWindowSafe = openWindowSafe;
exports.isObjStr = isObjStr;
exports.arrayToTree = arrayToTree;
exports.treeToArr = exports.toPercent = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// import cloneDeep from 'clone-deep';

/**
 * 日期格式化方法
 */
function formatDate(dt, patter) {
  var format = patter;
  var date = dt;

  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }

  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  };

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, "".concat(date.getFullYear()).substr(4 - RegExp.$1.length));
  }

  Object.keys(o).forEach(function (k) {
    if (new RegExp("(".concat(k, ")")).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : "00".concat(o[k]).substr("".concat(o[k]).length));
    }
  });
  return format;
}
/**
 * @param  name {String}
 * @return  {String}
 */


function queryURL(name) {
  var reg = new RegExp("(^|&)".concat(name, "=([^&]*)(&|$)"), 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r !== null) return decodeURI(r[2]);
  return null;
}
/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */


function queryArray(array, key) {
  var keyAlias = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'key';

  if (!(array instanceof Array)) {
    return null;
  }

  var item = array.filter(function (_) {
    return _[keyAlias] === key;
  });

  if (item.length) {
    return item[0];
  }

  return null;
}
/**
 *
 * @param {*} array
 */


function getRealArray() {
  var result = [];
  return function deep(array, dp) {
    if (result.length > 0 && !dp) return result;

    for (var i = 0; i < array.length; i += 1) {
      result.push(array[i]);

      if (array[i].children && array[i].children.length > 0) {
        deep(array[i].children, true);
      }
    }

    return result;
  };
}

var cacheArray = getRealArray();

function queryDeepArray(array, key, keyAlias) {
  var searchArray = cacheArray(array);
  return queryArray(searchArray, key, keyAlias);
}
/**
 * 判断是否是对象
 * @param {*} obj obj
 */


function isObject(obj) {
  return obj !== null && _typeof(obj) === 'object';
}
/**
 *
 * @param {*} a 对象深比较A
 * @param {*} b 对象深比较A
 */


function looseEqual(a, b) {
  if (a === b) return true;
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);

  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);

      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i]);
        });
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key]);
        });
      }
      /* istanbul ignore next */


      return false;
    } catch (e) {
      /* istanbul ignore next */
      return false;
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b);
  } else {
    return false;
  }
} // 保留两位小数，四舍五入


var toPercent = function toPercent(number) {
  return Math.round(number * 100) / 100;
};
/* eslint-disable */
// 生成随机字符串


exports.toPercent = toPercent;

function createUUID() {
  return 'xy-4yx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 || 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
} // form 参数 转化为Obj


function urlStrToObj(url) {
  if (!url) return; //const urlStr = decodeURIComponent(url);

  return url.split('&').map(function (it) {
    var _it$split = it.split('='),
        _it$split2 = _slicedToArray(_it$split, 2),
        key = _it$split2[0],
        value = _it$split2[1];

    return _defineProperty({}, key, decodeURIComponent(value));
  }).reduce(function (p, next) {
    Object.assign(p, next);
    return p;
  }, {});
} // 将对象转成字符串


function objToUrlStr(obj) {
  if (!obj) return;
  return Object.keys(obj).map(function (key) {
    return "".concat(key, "=").concat(encodeURIComponent(obj[key]));
  }).join('&');
} // 深度去除空格


function deepTrim(param) {
  param && isObject(param) && Object.keys(param).forEach(function (key) {
    //  const value = ;
    if (!!param[key]) {
      if (typeof param[key] === 'string') {
        param[key] = param[key].trim(); //数组方式忽略
      } else if (_typeof(param[key]) === 'object' && !Array.isArray(param[key])) {
        deepTrim(param[key]);
      }
    }
  });
  return param;
}
/**
 * 数组转化成tree
 * @param {*} data
 */


function dataToTreeV2(data) {
  return new Promise(function (resolve) {
    groupBy(data, function (item, callback) {
      callback(null, item.parentId);
    }, function (err, result) {
      resolve(loopTransform(result, 0, {}));
    });
  });
}
/**
 * 遍历数组转化成树
 * @param {*} data
 * @param {*} startIndex
 * @param {*} result
 */


function loopTransform(data, startIndex, result) {
  var items = data[startIndex];
  Array.isArray(items) && items.length > 0 && items.forEach(function (it) {
    var item = _objectSpread({}, it);

    item.label = it.name;
    item.value = "".concat(it.id);
    item.key = "".concat(it.id);

    if (Array.isArray(result.children)) {
      result.children.push(item);
    } else {
      result.children = [item];
    }

    if (Array.isArray(data[it.id])) {
      loopTransform(data, it.id, item);
    }
  });
  return result.children;
}

function convert(list) {
  var res = [];
  var map = list.reduce(function (res, v) {
    return res[v.id] = v, res;
  }, {});
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      if (item.parentId === 0) {
        res.push(item);
        continue;
      }

      if (item.parentId in map) {
        var parent = map[item.parentId];
        parent.children = parent.children || [];
        parent.children.push(item);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return res;
}

var treeToArr = function treeToArr(treeData) {
  var arr = [];

  var recursion = function recursion(treeData, parentKey) {
    treeData.forEach(function (value) {
      if (value.children) {
        arr.push(_objectSpread({}, value, {
          parentKey: _toConsumableArray(parentKey)
        }));
        recursion(value.children, [].concat(_toConsumableArray(parentKey), [value.key]));
      } else {
        arr.push(_objectSpread({}, value, {
          parentKey: _toConsumableArray(parentKey)
        }));
      }
    });
  };

  recursion(treeData, []);
  return arr;
};

exports.treeToArr = treeToArr;

function openWindowSafe(url) {
  var aele = document.createElement('a');
  var $url = "".concat(location.origin).concat(location.pathname).concat(location.search, "#").concat(url);
  aele.href = $url;
  Object.assign(aele, {
    target: '_blank',
    rel: 'noopener'
  }); // aele.target = '_blank',
  // aele.rel = 'noopener';

  aele.style.visibility = 'hidden';
  document.body.appendChild(aele);
  aele.click();
  nextTick(function () {
    aele.remove();
  });
}

function isObjStr(str) {
  return /^\{.*\}$/g.test(str);
}
/**
* 数组格式转树状结构
* @param   {array}     array
* @param   {String}    id
* @param   {String}    pid
* @param   {String}    children
* @return  {Array}
*/


function arrayToTree(array) {
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'id';
  var pid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'pid';
  var children = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'children';
  return convert(array);
}