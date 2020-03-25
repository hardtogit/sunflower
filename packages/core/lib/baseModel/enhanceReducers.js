"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _type = _interopRequireDefault(require("../utils/type"));

var _object = require("../utils/object");

var _localStorage = _interopRequireDefault(require("./localStorage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var REMAIN_CORE_STATE = '$$reset_part_state';
var LOCAL_STATE_SEP = '_';

function getLocalStateKey(namespace) {
  return function (stateKey) {
    return "$$".concat(namespace).concat(LOCAL_STATE_SEP, "state").concat(LOCAL_STATE_SEP).concat(stateKey);
  };
}

var _default = function _default(reducers, _ref) {
  var initialState = _ref.initialState,
      namespace = _ref.namespace,
      initialLocalState = _ref.initialLocalState,
      allNSLocalState = _ref.allNSLocalState;
  var AWLAYS_RESET_KEYS = ['visible', 'loading']; // initialState = { ...initialState };

  var getNSLocalStateKey = getLocalStateKey(namespace);

  var createLoadingReducer = function createLoadingReducer(originValue) {
    return function (state, _ref2) {
      var _ref2$payload = _ref2.payload,
          payload = _ref2$payload === void 0 ? {} : _ref2$payload;
      var key = payload.key,
          extra = payload.extra;
      var parentKey = 'loading';
      var parentState = state[parentKey];
      var value = originValue; // 扩展数据

      if (extra) {
        value = Object.assign(Boolean(originValue), extra);
      }

      parentState = _objectSpread({}, parentState, _defineProperty({}, key, value));
      return _objectSpread({}, state, _defineProperty({}, parentKey, parentState));
    };
  };

  return Object.assign(reducers, {
    showLoading: createLoadingReducer(true),
    hideLoading: createLoadingReducer(false),
    updateState: function updateState(state, _ref3) {
      var payload = _ref3.payload;
      return _objectSpread({}, state, {}, payload);
    },
    updateSearch: function updateSearch(state, _ref4) {
      var payload = _ref4.payload;
      return _objectSpread({}, state, {
        search: _objectSpread({}, state.search, {}, payload)
      });
    },
    resetSearch: function resetSearch(state) {
      return _objectSpread({}, state, {
        search: _objectSpread({}, initialState.search)
      });
    },

    /* 如果传入force为true，则重置所有state
     * 如果传入keys, 则重置指定keys以及状态类(confirm,spinning等)state
     * 如果既未设置force，也未设置keys, 则根据localStorage中RESET_PART_STATE的值来决定部分重置还是全量重置
     */
    resetState: function resetState(state, _ref5) {
      var _ref5$payload = _ref5.payload,
          payload = _ref5$payload === void 0 ? {} : _ref5$payload;
      var force = payload.force;
      var keys = payload.keys;

      var nextState = _objectSpread({}, initialState);

      var resetAllState = localStorage.getItem(REMAIN_CORE_STATE) !== 'true';

      if (force) {
        resetAllState = true;
      } else if (keys) {
        resetAllState = false;
      }

      if (!resetAllState) {
        keys = keys || [];
        var resetKeys = keys.concat(AWLAYS_RESET_KEYS);
        var needResetState = (0, _object.pick)(initialState, resetKeys);
        nextState = _objectSpread({}, state, {}, needResetState);
      }

      localStorage.setItem(REMAIN_CORE_STATE, false);
      return nextState;
    },
    localizeState: function localizeState(state, _ref6) {
      var _ref6$payload = _ref6.payload,
          payload = _ref6$payload === void 0 ? {} : _ref6$payload;
      Object.keys(payload).forEach(function (key) {
        var value = payload[key];
        allNSLocalState[namespace][key] = value;

        _localStorage["default"].setItem(getNSLocalStateKey(key), value);
      });
      return state;
    },

    /**
     * 如果传入force为true，则重置与本model相关的所有持久化state
     * 如果传入keys, 则重置指定keys的持久化state
     */
    clearLocalState: function clearLocalState(state, _ref7) {
      var _ref7$payload = _ref7.payload,
          payload = _ref7$payload === void 0 ? {} : _ref7$payload;
      var force = payload.force,
          keys = payload.keys; // 当前ns下所有local state

      var localState = allNSLocalState[namespace];

      if (force) {
        allNSLocalState[namespace] = {};
        Object.keys(localState).forEach(function (key) {
          localStorage.removeItem(getNSLocalStateKey(key));
        });
      } else if (keys) {
        if (!_type["default"].isArray(keys)) {
          throw new Error('clearLocalState must have the payload parameter with an array typeof keys ');
        }

        keys.forEach(function (key) {
          delete allNSLocalState[namespace][key];
          localStorage.removeItem(getNSLocalStateKey(key));
        });
      }

      return state;
    },

    /**
     * 如果传入force为true，则重置与本model相关的所有持久化state
     * 如果传入keys, 则重置指定keys的持久化state
     */
    resetLocalState: function resetLocalState(state, _ref8) {
      var _ref8$payload = _ref8.payload,
          payload = _ref8$payload === void 0 ? {} : _ref8$payload;
      var force = payload.force,
          keys = payload.keys;

      if (force) {
        allNSLocalState[namespace] = initialLocalState;
        Object.keys(initialLocalState).forEach(function (key) {
          var value = initialLocalState[key];

          _localStorage["default"].setItem(getNSLocalStateKey(key), value);
        });
      } else if (keys) {
        if (!_type["default"].isArray(keys)) {
          throw new Error('resetLocalState must have the payload parameter with an array typeof keys ');
        }

        keys.forEach(function (key) {
          var value = initialLocalState[key];
          allNSLocalState[namespace][key] = value;

          _localStorage["default"].setItem(getNSLocalStateKey(key), value);
        });
      }

      return state;
    }
  });
};

exports["default"] = _default;