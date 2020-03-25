"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bmodel = void 0;

var _ = _interopRequireDefault(require("."));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var bmodel = new _["default"]({
  reducers: {
    goPageV2: function goPageV2(state, _ref) {
      var payload = _ref.payload;
      var current = payload.current,
          name = payload.name;

      if (name) {
        if (state[name] && state[name].pagination) {
          var pagination = state[name].pagination;
          pagination.current = current;
          return _objectSpread({}, state, _defineProperty({}, name, _objectSpread({}, state[name])));
        }
      }

      return _objectSpread({}, state, {
        pagination: _objectSpread({}, state.pagination, {
          current: current
        })
      });
    },
    successPage: function successPage(state, _ref2) {
      var payload = _ref2.payload;
      var list = payload.list,
          name = payload.name,
          tc = payload.tc;

      if (name && state[name]) {
        var nobj = state[name];

        var obj = _objectSpread({}, nobj, {
          pagination: _objectSpread({}, nobj.pagination, {
            total: tc
          }),
          list: list
        });

        return _objectSpread({}, state, _defineProperty({}, name, _objectSpread({}, obj)));
      }

      return _objectSpread({}, state, {
        pagination: _objectSpread({}, state.pagination, {
          total: tc
        }),
        list: list
      });
    }
  }
});
exports.bmodel = bmodel;