"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultSearch = {
  pn: 1,
  ps: 10
};
var defaultLoading = {
  list: false,
  confirm: false,
  submit: false,
  spin: false
};

var _default = function _default() {
  var configState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var localState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var search = _objectSpread({}, defaultSearch, {}, configState.search || {}, {}, state.search || {}, {}, localState.search || {});

  var loading = _objectSpread({}, defaultLoading, {}, configState.loading || {}, {}, state.loading || {}, {}, localState.loading || {});

  return _objectSpread({
    detail: {},
    datas: [],
    tc: 0
  }, configState, {}, state, {}, localState, {
    search: search,
    loading: loading
  });
};

exports["default"] = _default;