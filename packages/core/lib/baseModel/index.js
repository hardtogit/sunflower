"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.REMAIN_CORE_STATE = void 0;

var _localStorage = _interopRequireDefault(require("./localStorage"));

var _getInitialState = _interopRequireDefault(require("./getInitialState"));

var _enhanceEffects = _interopRequireDefault(require("./enhanceEffects"));

var _enhanceReducers = _interopRequireDefault(require("./enhanceReducers"));

var _enhanceSubscriptions = _interopRequireDefault(require("./enhanceSubscriptions"));

var _extend = _interopRequireDefault(require("./extend"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var REMAIN_CORE_STATE = '$$reset_part_state';
exports.REMAIN_CORE_STATE = REMAIN_CORE_STATE;
var LOCAL_STATE_SEP = '_'; // 获取初始localStorage值

var initialLocalStorage = Object.keys(_localStorage["default"]).reduce(function (last, key) {
  return _objectSpread({}, last, _defineProperty({}, key, _localStorage["default"].getItem[key]));
}, {}); // 获取所有对应namespace下的local state

var allNSLocalState = {};

function getLocalStateKey(namespace) {
  // eslint-disable-next-line
  return function (stateKey) {
    return "$$".concat(namespace).concat(LOCAL_STATE_SEP, "state").concat(LOCAL_STATE_SEP).concat(stateKey);
  };
}

function getInitialLocalState(namespace) {
  var matchNSKey = getLocalStateKey(namespace)('');
  return Object.keys(initialLocalStorage).reduce(function (last, key) {
    var next = _objectSpread({}, last); // 检测是否属于当前ns的state


    if (key.startsWith(matchNSKey)) {
      var localState = initialLocalStorage[key]; // 删除已经遍历过的属性

      delete initialLocalStorage[key]; // 获取当前ns下对应的state属性

      var nsStateKey = key.split(LOCAL_STATE_SEP).pop(); // 将取出的local的ns和state的存储起来

      allNSLocalState[namespace][nsStateKey] = localState;
      Object.assign(next, _defineProperty({}, nsStateKey, localState));
    }

    return next;
  }, null);
}

var Model = /*#__PURE__*/function () {
  function Model() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Model);

    this.config = config;
  }

  _createClass(Model, [{
    key: "extend",
    value: function extend() {
      var userModel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var namespace = userModel.namespace,
          state = userModel.state,
          subscriptions = userModel.subscriptions,
          effects = userModel.effects,
          reducers = userModel.reducers;
      var initialLocalState = getInitialLocalState(namespace) || {};
      var initialState = (0, _getInitialState["default"])(this.config.state, state, initialLocalState);
      return {
        namespace: namespace,
        state: initialState,
        subscriptions: (0, _enhanceSubscriptions["default"])(subscriptions, {
          initialState: initialState
        }),
        effects: (0, _enhanceEffects["default"])(_objectSpread({}, this.config.effects, {}, effects), {
          namespace: namespace,
          allNSLocalState: allNSLocalState
        }),
        reducers: (0, _enhanceReducers["default"])(_objectSpread({}, this.config.reducers, {}, reducers), {
          namespace: namespace,
          initialState: initialState,
          initialLocalState: initialLocalState,
          allNSLocalState: allNSLocalState
        })
      };
    }
  }]);

  return Model;
}();

Model.extend = _extend["default"];
var _default = Model;
exports["default"] = _default;