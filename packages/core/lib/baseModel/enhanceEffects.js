"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _antd = require("antd");

var _type = _interopRequireDefault(require("../utils/type"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getNamespace = function getNamespace(type, namespace) {
  return type.includes('/') ? type.split('/')[0] : namespace;
};

var _default = function _default() {
  var effects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref = arguments.length > 1 ? arguments[1] : undefined,
      namespace = _ref.namespace,
      allNSLocalState = _ref.allNSLocalState;

  function createPutEffect(sagaEffects) {
    var _marked =
    /*#__PURE__*/
    regeneratorRuntime.mark(putEffect),
        _marked2 =
    /*#__PURE__*/
    regeneratorRuntime.mark(putSyncEffect);

    var put = sagaEffects.put,
        take = sagaEffects.take,
        select = sagaEffects.select;

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
      var type, tmpNamespace;
      return regeneratorRuntime.wrap(function putSyncEffect$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              type = action.type;
              tmpNamespace = getNamespace(type, namespace);
              _context2.next = 4;
              return put(action);

            case 4:
              _context2.next = 6;
              return take("".concat(type, "/@@end"));

            case 6:
              _context2.next = 8;
              return select(function (state) {
                return state[tmpNamespace];
              });

            case 8:
              return _context2.abrupt("return", _context2.sent);

            case 9:
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
    return (
      /*#__PURE__*/
      regeneratorRuntime.mark(function updateEffect(payload) {
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
      })
    );
  }

  function createSelectEffect(sagaEffects) {
    var select = sagaEffects.select;
    return (
      /*#__PURE__*/
      regeneratorRuntime.mark(function selectEffect() {
        var selector,
            allState,
            _args4 = arguments;
        return regeneratorRuntime.wrap(function selectEffect$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                selector = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : function (store) {
                  return store;
                };
                _context4.next = 3;
                return select();

              case 3:
                allState = _context4.sent;

                if (!(typeof selector === 'string')) {
                  _context4.next = 6;
                  break;
                }

                return _context4.abrupt("return", allState[selector]);

              case 6:
                return _context4.abrupt("return", selector(allState, allNSLocalState));

              case 7:
              case "end":
                return _context4.stop();
            }
          }
        }, selectEffect);
      })
    );
  }

  function createLocalizeEffect(sagaEffects) {
    var put = sagaEffects.put;
    return (
      /*#__PURE__*/
      regeneratorRuntime.mark(function localizeEffect(payload) {
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
      })
    );
  }

  function createExtraEffect(sagaEffects) {
    var put = sagaEffects.put,
        call = sagaEffects.call;
    return (
      /*#__PURE__*/
      regeneratorRuntime.mark(function extraCallEffect(serviceFn) {
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

                if (_type["default"].isNill(key)) {
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

                if (_type["default"].isNill(key)) {
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
      })
    );
  }

  return Object.keys(effects).reduce(function (next, key) {
    var _marked3 =
    /*#__PURE__*/
    regeneratorRuntime.mark(wrapEffect);

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

exports["default"] = _default;