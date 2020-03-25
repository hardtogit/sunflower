"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _PageModule = _interopRequireDefault(require("./Page.module.less"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(props) {
  return _react.default.createElement("div", {
    className: props.className,
    style: props.searchStyle
  }, _react.default.createElement("div", {
    className: "listPage-searchBar"
  }, props.searchBar), _react.default.createElement("div", {
    className: "listPage-table",
    style: props.tableStyle
  }, props.table), props.children);
};

exports.default = _default;