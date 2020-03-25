"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ContainerContext = void 0;

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContainerContext = _react.default.createContext('');

exports.ContainerContext = ContainerContext;

var _default = function _default(props) {
  return _react.default.createElement(ContainerContext.Provider, {
    value: props.getPopupContainer
  }, _react.default.createElement(_antd.ConfigProvider, props, props.children));
};

exports.default = _default;