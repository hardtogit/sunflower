"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pathToRegexp = _interopRequireDefault(require("path-to-regexp"));

var _qs = _interopRequireDefault(require("qs"));

var _type = _interopRequireDefault(require("../utils/type"));

var _object = require("../utils/object");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var getQuery = function getQuery(search) {
  return _qs["default"].parse(search.slice(1));
};

var getParams = function getParams(match, key) {
  var params = match.slice(1);
  var paramsObj = {}; // 获取匹配的关键字

  var keys = key.match((0, _pathToRegexp["default"])(key)).slice(1); // 将关键字作为params的属性并赋值

  keys.forEach(function (item, index) {
    params[item.slice(1)] = params[index];
    paramsObj[item.slice(1)] = params[index];
  });
  return {
    params: params,
    paramsObj: paramsObj
  };
};
/**
 * 扩展subscription函数的参数,支持listen方法，方便监听path改变
 *
 * listen函数参数如下:
 * pathReg 需要监听的pathname
 * action 匹配path后的回调函数，action即可以是redux的action,也可以是回调函数
 * listen函数同时也支持对多个path的监听，参数为{ pathReg: action, ...} 格式的对象
 *
 * 示例:
 * subscription({ dispath, history, listen }) {
 *  listen('/user/list', { type: 'fetchUsers'});
 *  listen('/user/query', ({ query, params }) => {
 *    dispatch({
 *      type: 'fetchUsers',
 *      payload: params
 *    })
 *  });
 *  listen({
 *    '/user/list': ({ query, params }) => {},
 *    '/user/query': ({ query, params }) => {},
 *  });
 * }
 */


var _default = function _default() {
  var subscriptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref = arguments.length > 1 ? arguments[1] : undefined,
      _ref$initialState = _ref.initialState,
      initialState = _ref$initialState === void 0 ? {} : _ref$initialState;

  function createWrappedSubscriber(subscriber) {
    return function (props) {
      var dispatch = props.dispatch,
          history = props.history;

      var listen = function listen(pathReg, handleEnter, handleLeave) {
        var enhance = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
        var listeners = {}; // 保存进入path的路由信息

        var enteredRoute = null;

        if (typeof handleLeave === 'boolean') {
          enhance = handleLeave; // eslint-disable-line
        }

        if (_typeof(pathReg) === 'object') {
          listeners = pathReg;
        } else {
          listeners[pathReg] = [handleEnter, handleLeave];
        } // 进入listener之前执行的操作，如：重置状态，更新search，更新状态中的params值


        var beforeEnterListener = function beforeEnterListener(_ref2) {
          var query = _ref2.query,
              paramsObj = _ref2.paramsObj;
          // 从 query 中获取 search 需要的数据
          var searchKeys = Object.keys(initialState.search);
          var search = (0, _object.pick)(query, searchKeys);
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
        };

        history.listen(function (location) {
          var _location$pathname = location.pathname,
              pathname = _location$pathname === void 0 ? '' : _location$pathname,
              _location$search = location.search,
              search = _location$search === void 0 ? '' : _location$search;
          Object.keys(listeners).forEach(function (key) {
            var actions = listeners[key];
            var enterAction = null;
            var leaveAction = null;

            if (_type["default"].isFunction(actions)) {
              // 表示即只有默认的handleEnter
              enterAction = actions;
            } else if (_type["default"].isArray(actions)) {
              enterAction = actions[0];
              leaveAction = actions[1];
            }

            var match = (0, _pathToRegexp["default"])(key).exec(pathname);

            if (match) {
              // 获取 query
              var query = getQuery(search);
              /**
               * params 获取到的数据：[1, id: 1]
               * paramsObj 是一个普通对象，如：{ id: 1 }
               */

              var _getParams = getParams(match, key),
                  params = _getParams.params,
                  paramsObj = _getParams.paramsObj;

              var route = _objectSpread({}, location, {
                params: params,
                paramsObj: paramsObj,
                query: query
              });

              if (_typeof(enterAction) === 'object') {
                var action = enterAction;

                enterAction = function enterAction() {
                  return dispatch(action);
                };
              }

              if (enhance) {
                beforeEnterListener(route);
              }

              enterAction(route); // 保存路由信息

              enteredRoute = route;
            } else if (enteredRoute && leaveAction) {
              // 1、没有匹配path，且enteredRoute不为null
              // 2、那就表示离开path，并触发onLeave
              if (_typeof(leaveAction) === 'object') {
                dispatch(leaveAction);
              } else if (typeof leaveAction === 'function') {
                leaveAction(enteredRoute);
              } // 清除路由信息


              enteredRoute = null;
            }
          });
        });
      };

      subscriber(_objectSpread({}, props, {
        listen: listen
      }));
    };
  }

  return Object.keys(subscriptions).reduce(function (last, key) {
    last[key] = createWrappedSubscriber(subscriptions[key]);
    return last;
  }, {});
};

exports["default"] = _default;