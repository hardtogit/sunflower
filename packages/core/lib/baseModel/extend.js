"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.REMAIN_CORE_STATE = void 0;

var _antd = require("antd");

var _pathToRegexp = _interopRequireDefault(require("path-to-regexp"));

var _qs = _interopRequireDefault(require("qs"));

var _type = _interopRequireDefault(require("../utils/type"));

var _object = require("../utils/object");

var _dva = require("../utils/dva");

var _localStorage = _interopRequireDefault(require("./localStorage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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


var enhanceSubscriptions = function enhanceSubscriptions() {
  var subscriptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  function createWrappedSubscriber(subscriber) {
    return function (props) {
      var dispatch = props.dispatch,
          history = props.history;

      var listen = function listen(pathReg, handleEnter, handleLeave) {
        var listeners = {}; // 保存进入path的路由信息

        var enteredRoute = null;

        if (_typeof(pathReg) == 'object') {
          listeners = pathReg;
        } else {
          listeners[pathReg] = [handleEnter, handleLeave];
        }

        history.listen(function (location) {
          var pathname = location.pathname;
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
              // 1、进入路由即触发onEnter
              // 2、并保存本次路由信息，用于判断是否是离开path和触发onLeave
              var query = _qs["default"].parse(location.search.slice(1)); // 获取匹配的值


              var params = match.slice(1); // 获取匹配的关键字

              var keys = key.match((0, _pathToRegexp["default"])(key)).slice(1); // 将关键字作为params的属性并赋值

              keys.forEach(function (item, index) {
                return params[item.slice(1)] = params[index];
              });

              var route = _objectSpread({}, location, {
                params: params,
                query: query
              });

              enteredRoute = route;

              if (_typeof(enterAction) == 'object') {
                dispatch(enterAction);
              } else if (typeof enterAction == 'function') {
                enterAction(route);
              }
            } else if (enteredRoute && leaveAction) {
              // 1、没有匹配path，且enteredRoute不为null
              // 2、那就表示离开path，并触发onLeave
              if (_typeof(leaveAction) == 'object') {
                dispatch(leaveAction);
              } else if (typeof leaveAction == 'function') {
                leaveAction(enteredRoute);
              }

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
/**
 * 扩展effect函数中的sagaEffects参数
 * 支持:
 *  put 扩展put方法，支持put.sync
 *  update 扩展自put方法，方便直接更新state数据，update({ item: item});
 *  call,
 */


var enhanceEffects = function enhanceEffects() {
  var effects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var namespace = arguments.length > 1 ? arguments[1] : undefined;

  function createPutEffect(sagaEffects) {
    var _marked = /*#__PURE__*/regeneratorRuntime.mark(putEffect),
        _marked2 = /*#__PURE__*/regeneratorRuntime.mark(putSyncEffect);

    var put = sagaEffects.put,
        call = sagaEffects.call;

    function putEffect(action) {
      return regeneratorRuntime.wrap(function putEffect$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return put(action);

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _marked);
    }

    function putSyncEffect(action) {
      var type, effectFn;
      return regeneratorRuntime.wrap(function putSyncEffect$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              type = action.type;
              effectFn = (0, _dva.getEffect)(type, namespace);
              _context2.next = 4;
              return call(effectFn, action, sagaEffects);

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _marked2);
    }

    putEffect.sync = putSyncEffect;
    return putEffect;
  }

  function createUpdateEffect(sagaEffects) {
    var put = sagaEffects.put;
    return /*#__PURE__*/regeneratorRuntime.mark(function updateEffect(payload) {
      return regeneratorRuntime.wrap(function updateEffect$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return put({
                type: 'updateState',
                payload: payload
              });

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, updateEffect);
    });
  }

  function createSelectEffect(sagaEffects) {
    var select = sagaEffects.select;
    return /*#__PURE__*/regeneratorRuntime.mark(function selectEffect() {
      var selector,
          _args4 = arguments;
      return regeneratorRuntime.wrap(function selectEffect$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              selector = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : function (store) {
                return store;
              };
              _context4.t0 = selector;
              _context4.next = 4;
              return select();

            case 4:
              _context4.t1 = _context4.sent;
              _context4.t2 = allNSLocalState;
              return _context4.abrupt("return", (0, _context4.t0)(_context4.t1, _context4.t2));

            case 7:
            case "end":
              return _context4.stop();
          }
        }
      }, selectEffect);
    });
  }

  function createLocalizeEffect(sagaEffects) {
    var put = sagaEffects.put;
    return /*#__PURE__*/regeneratorRuntime.mark(function localizeEffect(payload) {
      return regeneratorRuntime.wrap(function localizeEffect$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return put({
                type: 'localizeState',
                payload: payload
              });

            case 2:
            case "end":
              return _context5.stop();
          }
        }
      }, localizeEffect);
    });
  }

  function createExtraEffect(sagaEffects) {
    var put = sagaEffects.put,
        call = sagaEffects.call;
    return /*#__PURE__*/regeneratorRuntime.mark(function extraCallEffect(serviceFn) {
      var result,
          done,
          config,
          key,
          withDone,
          successMsg,
          errorMsg,
          _len,
          args,
          _key,
          payload,
          _args6 = arguments;

      return regeneratorRuntime.wrap(function extraCallEffect$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              done = true;
              config = serviceFn.withExtra || {};
              key = config.key, withDone = config.withDone, successMsg = config.successMsg, errorMsg = config.errorMsg;

              if (_type["default"].isEmpty(key)) {
                _context6.next = 6;
                break;
              }

              _context6.next = 6;
              return put({
                type: 'showLoading',
                payload: {
                  key: key
                }
              });

            case 6:
              _context6.prev = 6;

              for (_len = _args6.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = _args6[_key];
              }

              _context6.next = 10;
              return call.apply(void 0, [serviceFn].concat(args));

            case 10:
              result = _context6.sent;
              successMsg && _antd.message.success(successMsg);
              _context6.next = 19;
              break;

            case 14:
              _context6.prev = 14;
              _context6.t0 = _context6["catch"](6);
              done = false;
              errorMsg && _antd.Modal.error({
                title: errorMsg
              });
              throw _context6.t0;

            case 19:
              _context6.prev = 19;

              if (_type["default"].isEmpty(key)) {
                _context6.next = 25;
                break;
              }

              payload = {
                key: key
              };

              if (withDone) {
                payload.extra = {
                  done: done
                };
              }

              _context6.next = 25;
              return put({
                type: 'hideLoading',
                payload: payload
              });

            case 25:
              return _context6.finish(19);

            case 26:
              return _context6.abrupt("return", result);

            case 27:
            case "end":
              return _context6.stop();
          }
        }
      }, extraCallEffect, null, [[6, 14, 19, 26]]);
    });
  }

  return Object.keys(effects).reduce(function (next, key) {
    var _marked3 = /*#__PURE__*/regeneratorRuntime.mark(wrapEffect);

    var originEffect = effects[key];
    var isArray = Array.isArray(originEffect);
    var effectFunc = isArray ? originEffect[0] : originEffect;

    function wrapEffect(action, sagaEffects) {
      return regeneratorRuntime.wrap(function wrapEffect$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return effectFunc(action, _objectSpread({}, sagaEffects, {
                put: createPutEffect(sagaEffects),
                update: createUpdateEffect(sagaEffects),
                localize: createLocalizeEffect(sagaEffects),
                select: createSelectEffect(sagaEffects),
                call: createExtraEffect(sagaEffects)
              }));

            case 2:
              return _context7.abrupt("return", _context7.sent);

            case 3:
            case "end":
              return _context7.stop();
          }
        }
      }, _marked3);
    }

    next[key] = isArray ? [wrapEffect, originEffect[1]] : wrapEffect;
    return next;
  }, {});
};

function enhanceReducers(reducers, _ref) {
  var initialState = _ref.initialState,
      namespace = _ref.namespace,
      initialLocalState = _ref.initialLocalState;
  var AWLAYS_RESET_KEYS = ['visible', 'loading'];
  initialState = _objectSpread({}, initialState);
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

    /* params eg {key:'users',current}  多table
    * 如果不传入key,则更新最外层的pagination
    */
    goPage: function goPage(state, _ref3) {
      var payload = _ref3.payload;
      var key = payload.key,
          current = payload.current;

      if (!key) {
        return _objectSpread({}, state, {
          pagination: _objectSpread({}, state.pagination, {
            current: payload
          })
        });
      }

      return _objectSpread({}, state, _defineProperty({}, key, _objectSpread({}, state[key], {
        pagination: _objectSpread({}, state[key].pagination, {
          current: current
        })
      })));
    },
    successPage: function successPage(state, _ref4) {
      var payload = _ref4.payload;
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
    },
    updateState: function updateState(state, _ref5) {
      var payload = _ref5.payload;
      return _objectSpread({}, state, {}, payload);
    },

    /* 如果传入force为true，则重置所有state
     * 如果传入keys, 则重置指定keys以及状态类(confirm,spinning等)state
     * 如果既未设置force，也未设置keys, 则根据localStorage中RESET_PART_STATE的值来决定部分重置还是全量重置
     */
    resetState: function resetState(state, _ref6) {
      var _ref6$payload = _ref6.payload,
          payload = _ref6$payload === void 0 ? {} : _ref6$payload;
      var force = payload.force,
          keys = payload.keys;

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
    localizeState: function localizeState(state, _ref7) {
      var _ref7$payload = _ref7.payload,
          payload = _ref7$payload === void 0 ? {} : _ref7$payload;
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
    clearLocalState: function clearLocalState(state, _ref8) {
      var _ref8$payload = _ref8.payload,
          payload = _ref8$payload === void 0 ? {} : _ref8$payload;
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
    resetLocalState: function resetLocalState(state, _ref9) {
      var _ref9$payload = _ref9.payload,
          payload = _ref9$payload === void 0 ? {} : _ref9$payload;
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
}

function createModal(model) {
  return Object.assign({
    state: {
      loading: {}
    },
    subscriptions: {},
    effects: {},
    reducers: {}
  }, model);
}
/**
 * 模型继承方法
 *
 * 如果参数只有一个，则继承默认model
 * @param parent
 * @param properties
 */


var _default = function _default(parent, properties) {
  if (_type["default"].isEmpty(properties)) {
    properties = parent;
    parent = null;
  }

  var model = createModal(parent);
  var _properties = properties,
      namespace = _properties.namespace,
      initialState = _properties.state,
      subscriptions = _properties.subscriptions,
      effects = _properties.effects,
      reducers = _properties.reducers;
  allNSLocalState[namespace] = {};
  var initialLocalState = getInitialLocalState(namespace);
  Object.assign(initialState, initialLocalState);
  Object.assign(model, {
    namespace: namespace
  });
  Object.assign(model.state, initialState);
  Object.assign(model.reducers, enhanceReducers(reducers, {
    namespace: namespace,
    initialState: model.state,
    initialLocalState: initialLocalState
  }));
  Object.assign(model.effects, enhanceEffects(effects, namespace));
  Object.assign(model.subscriptions, enhanceSubscriptions(subscriptions, namespace));
  return model;
};

exports["default"] = _default;