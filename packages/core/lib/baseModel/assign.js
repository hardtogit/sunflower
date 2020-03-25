"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _router = require("dva/router");

var _lodash = require("lodash");

var _extend = _interopRequireDefault(require("./extend"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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
/**
 * 扩展 Model.assign，用法和 Model.extend 一致，增加了更多的内置元素，需要使用者了解更多的约定
 * 默认提供以下内容
 * 1.state添加默认值: { tc: 0, datas: [], detail: {}, search: { pn: 1, ps: 10 } },
 *   loading: { list: false, confirm: false, submit: false, spin: false } }
 *
 * 2.为了和 Model.extend 的 subscriptions 属性使用一致，这里同步扩展了 listen 的3种使用方式，如下：
 *   a.支持传3个参数
 *     listen(path, listener, force)
 *   b.支持第二个参数为对象
 *     listen(path, { type: 'getList' }, force)
 *   c.支持传2个参数，第一个参数是一个对象，用来处理多个 path 在同一个 model 中使用的情况
 *     listen({ path1: listener, path2: listener }, force)
 *
 *   这里可以看出使用方式和以前几乎相同，不同的地方在于，最后一个参数 force，当它为 true 的时候，将不对之前的 listeners 做扩展，方便用户自定义处理特殊需求
 *
 * 3.扩展了上面 listen 中的 listener 方法
 *   a.对 params 和 query 进行预处理，将 params 的数据放在了 state 中，将 query 的和搜索相关的数据放在了 search 中
 *   b.默认会执行 resetState 方法
 *
 * 4.effects 添加默认值: goBack
 * 5.reducers 添加默认值: updateSearch 和 resetSearch
 */

var _default = function _default(_ref, parent) {
  var namespace = _ref.namespace,
      state = _ref.state,
      subscriptions = _ref.subscriptions,
      effects = _ref.effects,
      reducers = _ref.reducers;

  var initialSearch = _objectSpread({}, defaultSearch, {}, state.search);

  var enhanceSubscriptions = function enhanceSubscriptions() {
    var subscriptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    function createWrappedSubscriber(subscriber) {
      return function (props) {
        var dispatch = props.dispatch;

        var enhanceListener = function enhanceListener(path, listener) {
          return function (_ref2) {
            var query = _ref2.query,
                params = _ref2.params,
                reset = _objectWithoutProperties(_ref2, ["query", "params"]);

            // 从 query 中获取 search 需要的数据
            var searchKeys = Object.keys(initialSearch);

            var search = _lodash._.pick(query, searchKeys); // 获取 params 中数据


            var paramsObj = Object.keys(params).reduce(function (obj, key) {
              if (!/\d+/.test(key)) {
                obj[key] = params[key];
              }

              return obj;
            }, {});
            dispatch({
              type: 'resetState',
              payload: {
                force: true
              }
            });
            dispatch({
              type: 'updateSearch',
              payload: search
            });
            dispatch({
              type: 'updateState',
              payload: paramsObj
            });
            listener(_objectSpread({
              query: query,
              params: paramsObj
            }, reset));
          };
        };

        var listen = function listen() {
          var pathObj = arguments.length <= 0 ? undefined : arguments[0];
          var force = arguments.length <= 1 ? undefined : arguments[1];
          var listener = null;

          if (_typeof(force) === 'object') {
            listener = function listener() {
              return dispatch(force);
            };

            force = arguments.length <= 2 ? undefined : arguments[2];
          }

          if (typeof force === 'function') {
            listener = force;
            force = arguments.length <= 2 ? undefined : arguments[2];
          }

          if (typeof pathObj === 'string') {
            pathObj = _defineProperty({}, pathObj, listener);
          }

          if (force) {
            props.listen.apply(props, arguments);
          } else {
            Object.keys(pathObj).forEach(function (path) {
              var listener = pathObj[path];
              props.listen(path, enhanceListener(path, listener));
            });
          }
        };

        subscriber(_objectSpread({}, props, {
          listen: listen
        }));
      };
    }

    return Object.keys(subscriptions).reduce(function (obj, key) {
      obj[key] = createWrappedSubscriber(subscriptions[key]);
      return obj;
    }, {});
  };

  var defalutModel = {
    state: {
      tc: 0,
      datas: [],
      detail: {}
    },
    effects: {
      goBack:
      /*#__PURE__*/
      regeneratorRuntime.mark(function goBack(_ref3, _ref4) {
        var path, put;
        return regeneratorRuntime.wrap(function goBack$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                path = _ref3.payload;
                put = _ref4.put;

                if (!path) {
                  _context.next = 7;
                  break;
                }

                _context.next = 5;
                return put(_router.routerRedux.push(path));

              case 5:
                _context.next = 9;
                break;

              case 7:
                _context.next = 9;
                return put(_router.routerRedux.goBack());

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, goBack);
      })
    },
    reducers: {
      updateSearch: function updateSearch(state, _ref5) {
        var payload = _ref5.payload;
        return _objectSpread({}, state, {
          search: _objectSpread({}, state.search, {}, payload)
        });
      },
      resetSearch: function resetSearch(state) {
        return _objectSpread({}, state, {
          search: _objectSpread({}, state.search, {}, initialSearch)
        });
      }
    }
  };

  var initialState = _objectSpread({}, defalutModel.state, {}, state, {
    search: initialSearch,
    loading: _objectSpread({}, defaultLoading, {}, state.loading)
  });

  var model = {
    namespace: namespace,
    state: initialState,
    subscriptions: _objectSpread({}, enhanceSubscriptions(subscriptions)),
    effects: _objectSpread({}, defalutModel.effects, {}, effects),
    reducers: _objectSpread({}, defalutModel.reducers, {}, reducers)
  };
  return (0, _extend["default"])(model, parent);
};

exports["default"] = _default;