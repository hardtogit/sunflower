"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.model = model;

var _dva = require("dva");

var routerRedux = _interopRequireWildcard(require("react-router-redux"));

var _model = _interopRequireDefault(require("./model.factory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getEffectsAndReducers(model, dispatch) {
  var effects = model.effects,
      reducers = model.reducers;
  var result = {};
  result = Object.keys(effects).reduce(function (prev, next) {
    var key = next.split('/')[1];
    return _objectSpread({}, prev, _defineProperty({}, key, function (param) {
      return dispatch({
        type: next,
        payload: param
      });
    }));
  }, result);
  result = Object.keys(reducers).reduce(function (prev, next) {
    var key = next.split('/')[1];
    return _objectSpread({}, prev, _defineProperty({}, key, function (param) {
      return dispatch({
        type: next,
        payload: param
      });
    }));
  }, result);
  result = _objectSpread({}, result, {}, {
    pop: function pop() {
      return dispatch(routerRedux.goBack());
    },
    replace: function replace(url) {
      return dispatch(routerRedux.replace(url));
    },
    push: function push(url) {
      return dispatch(routerRedux.push(url));
    }
  });
  return result;
}
/**
 * model 注解
 * @param {*} keys model namespace名称
 */


function model() {
  for (var _len = arguments.length, keys = new Array(_len), _key = 0; _key < _len; _key++) {
    keys[_key] = arguments[_key];
  }

  keys.unshift('layout');
  keys.unshift('commonModel');
  return function tar(target) {
    return (0, _dva.connect)(function (state) {
      return keys.reduce(function (prev, next) {
        return (// prev =
          _objectSpread({}, prev, {}, state[next])
        );
      }, {});
    }, function (dispatch) {
      var mergeDispatch = {};

      if (typeof keys[keys.length - 1] === 'function') {
        mergeDispatch = keys[keys.length - 1](dispatch);
      }

      var mapDispatch = keys.reduce(function (prev, next) {
        var model = _model["default"].getModel(next);

        if (model) {
          var actions = getEffectsAndReducers(model, dispatch);
          return _objectSpread({}, prev, {}, actions);
        }

        return _objectSpread({}, prev);
      }, {});
      mapDispatch.dispatch = dispatch;
      return _objectSpread({}, mapDispatch, {}, mergeDispatch);
    })(target);
  };
}