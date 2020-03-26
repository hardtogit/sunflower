"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = store;
exports.getEffect = getEffect;
exports.withLoading = withLoading;
exports.withMessage = withMessage;
exports.withConfirmLoading = withConfirmLoading;
exports.withSpinning = withSpinning;

var _type = _interopRequireDefault(require("./type"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 缓存dva app对象
function store(dvaApp) {
  return window.$$dvaApp = dvaApp;
} // 获取对应的effect函数


function getEffect(effectName, curNamespace) {
  var targetNamespace = effectName.includes('/') ? effectName.split('/')[0] : curNamespace;
  var targetEffectName = effectName.includes('/') ? effectName : "".concat(curNamespace, "/").concat(effectName);

  var targetModel = window.$$dvaApp._models.find(function (_ref) {
    var namespace = _ref.namespace;
    return namespace === targetNamespace;
  });

  return targetModel.effects[targetEffectName];
} // 附加loading信息, 需与call配置


function withLoading(service, key, successMsg, errorMsg, withDone) {
  var config = _type["default"].isString(key) ? {
    key: key
  } : _objectSpread({}, key);
  service.withExtra = _objectSpread({
    type: 'loading',
    successMsg: successMsg,
    errorMsg: errorMsg,
    withDone: withDone
  }, config);
  return service;
} // 附加消息信息, 需与call配置


function withMessage(service, successMsg, errorMsg) {
  service.withExtra = {
    type: 'message',
    successMsg: successMsg,
    errorMsg: errorMsg
  };
  return service;
} // 附加confirmLoading信息, 需与call配置


function withConfirmLoading(service, successMsg, errorMsg, withDone) {
  return withLoading(service, {
    successMsg: successMsg,
    errorMsg: errorMsg,
    withDone: withDone,
    key: 'confirm'
  });
} // 附加spinning信息, 需与call配置


function withSpinning(service, successMsg, errorMsg, withDone) {
  return withLoading(service, {
    successMsg: successMsg,
    errorMsg: errorMsg,
    withDone: withDone,
    key: 'spinning'
  });
}