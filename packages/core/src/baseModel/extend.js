/* eslint-disable */
import { message as Message, Modal } from 'antd';
import pathToRegexp from 'path-to-regexp'
import qs from 'qs';
import  Type  from '../utils/type';
import {pick} from '../utils/object'
import { getEffect } from '../utils/dva';
import storage from './localStorage';

export const REMAIN_CORE_STATE = '$$reset_part_state';

const LOCAL_STATE_SEP = '_';

// 获取初始localStorage值
const initialLocalStorage = Object.keys(storage).reduce((last, key) => ({ ...last, [key]: storage.getItem[key] }), {});

// 获取所有对应namespace下的local state
const allNSLocalState = {};

function getLocalStateKey(namespace) {
  return (stateKey) => `$$${namespace}${LOCAL_STATE_SEP}state${LOCAL_STATE_SEP}${stateKey}`;
}

function getInitialLocalState(namespace) {
  const matchNSKey = getLocalStateKey(namespace)('');
  return Object.keys(initialLocalStorage)
    .reduce((last, key) => {
      const next = { ...last };
      // 检测是否属于当前ns的state
      if (key.startsWith(matchNSKey)) {
        const localState = initialLocalStorage[key];
        // 删除已经遍历过的属性
        delete initialLocalStorage[key];
        // 获取当前ns下对应的state属性
        const nsStateKey = key.split(LOCAL_STATE_SEP).pop();
        // 将取出的local的ns和state的存储起来
        allNSLocalState[namespace][nsStateKey] = localState;
        Object.assign(next, { [nsStateKey]: localState });
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
const enhanceSubscriptions = (subscriptions = {}) => {
  function createWrappedSubscriber(subscriber) {
    return (props) => {
      const { dispatch, history } = props;
      const listen = (pathReg, handleEnter, handleLeave) => {
        let listeners = {};
        // 保存进入path的路由信息
        let enteredRoute = null;
        if (typeof pathReg == 'object') {
          listeners = pathReg;
        } else {
          listeners[pathReg] = [handleEnter, handleLeave];
        }
        history.listen((location) => {
          const { pathname } = location;
          Object.keys(listeners).forEach(key => {
            const actions = listeners[key];
            let enterAction = null;
            let leaveAction = null;
            if (Type.isFunction(actions)) {
              // 表示即只有默认的handleEnter
              enterAction = actions;
            } else if (Type.isArray(actions)) {
              enterAction = actions[0];
              leaveAction = actions[1];
            }
            const match = pathToRegexp(key).exec(pathname);
            if (match) {
              // 1、进入路由即触发onEnter
              // 2、并保存本次路由信息，用于判断是否是离开path和触发onLeave
              const query = qs.parse(location.search.slice(1));
              // 获取匹配的值
              const params = match.slice(1);
              // 获取匹配的关键字
              const keys = key.match(pathToRegexp(key)).slice(1);
              // 将关键字作为params的属性并赋值
              keys.forEach((item, index) => (params[item.slice(1)] = params[index]));
              const route = { ...location, params, query };
              enteredRoute = route;
              if (typeof enterAction == 'object') {
                dispatch(enterAction);
              } else if (typeof enterAction == 'function') {
                enterAction(route);
              }
            } else if (enteredRoute && leaveAction) {
              // 1、没有匹配path，且enteredRoute不为null
              // 2、那就表示离开path，并触发onLeave
              if (typeof leaveAction == 'object') {
                dispatch(leaveAction);
              } else if (typeof leaveAction == 'function') {
                leaveAction(enteredRoute);
              }
              enteredRoute = null;
            }
          });
        });
      };
      subscriber({ ...props, listen });
    };
  }

  return Object
    .keys(subscriptions)
    .reduce((last, key) => {
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
const enhanceEffects = (effects = {}, namespace) => {
  function createPutEffect(sagaEffects) {
    const { put, call } = sagaEffects;
    function* putEffect(action) {
      yield put(action);
    }

    function* putSyncEffect(action) {
      const { type } = action;
      const effectFn = getEffect(type, namespace);
      yield call(effectFn, action, sagaEffects);
    }

    putEffect.sync = putSyncEffect;

    return putEffect;
  }

  function createUpdateEffect(sagaEffects) {
    const { put } = sagaEffects;
    return function* updateEffect(payload) {
      yield put({ type: 'updateState', payload });
    };
  }

  function createSelectEffect(sagaEffects) {
    const { select } = sagaEffects;
    return function* selectEffect(selector = store => store) {
      return selector(yield select(), allNSLocalState);
    };
  }

  function createLocalizeEffect(sagaEffects) {
    const { put } = sagaEffects;
    return function* localizeEffect(payload) {
      yield put({ type: 'localizeState', payload });
    };
  }

  function createExtraEffect(sagaEffects) {
    const { put, call } = sagaEffects;

    return function* extraCallEffect(serviceFn, ...args) {
      let result;
      let done = true;
      const config = serviceFn.withExtra || {};
      const { key, withDone, successMsg, errorMsg } = config;

      if (!Type.isEmpty(key)) {
        yield put({ type: 'showLoading', payload: { key } });
      }

      try {
        result = yield call(serviceFn, ...args);
        successMsg && Message.success(successMsg);
      } catch (e) {
        done = false;
        errorMsg && Modal.error({ title: errorMsg });
        throw e;
      } finally {
        if (!Type.isEmpty(key)) {
          const payload = { key };
          if (withDone) {
            payload.extra = { done };
          }

          yield put({ type: 'hideLoading', payload });
        }
      }

      return result;
    };
  }

  return Object.keys(effects).reduce((next, key) => {
    const originEffect = effects[key];
    const isArray = Array.isArray(originEffect);

    const effectFunc = isArray ? originEffect[0] : originEffect;

    function* wrapEffect(action, sagaEffects) {
      return yield effectFunc(action, {
        ...sagaEffects,
        put: createPutEffect(sagaEffects),
        update: createUpdateEffect(sagaEffects),
        localize: createLocalizeEffect(sagaEffects),
        select: createSelectEffect(sagaEffects),
        call: createExtraEffect(sagaEffects)
      });
    }

    next[key] = isArray ? [wrapEffect, originEffect[1]] : wrapEffect;
    return next;
  }, {});
};

function enhanceReducers(reducers, { initialState, namespace, initialLocalState }) {
  const AWLAYS_RESET_KEYS = ['visible', 'loading'];
  initialState = { ...initialState };

  const getNSLocalStateKey = getLocalStateKey(namespace);

  const createLoadingReducer = (originValue) => (state, { payload = {} }) => {
    const { key, extra } = payload;
    const parentKey = 'loading';
    let parentState = state[parentKey];
    let value = originValue;

    // 扩展数据
    if (extra) {
      value = Object.assign(Boolean(originValue), extra);
    }
    parentState = { ...parentState, [key]: value };

    return {
      ...state,
      [parentKey]: parentState
    };
  };

  return Object.assign(reducers, {
    showLoading: createLoadingReducer(true),
    hideLoading: createLoadingReducer(false),
    /* params eg {key:'users',current}  多table
   * 如果不传入key,则更新最外层的pagination
   */
    goPage(state, {payload}){
      const {key,current}=payload
      if(!key){
        return {
          ...state,
          pagination:{...state.pagination,  current: payload}
        };
      }
      return {
        ...state,
        [key]:{
          ...state[key],
          pagination:{
            ...state[key].pagination,
            current:current
          }
        }
      };
    },
    successPage(state, {payload}){
      const {list, name, tc} = payload;
      if(name && state[name]){
         const nobj = state[name];
         const obj = {
           ...nobj,
           pagination: {...nobj.pagination, total: tc},
           list
         };
         return {
           ...state,
           [name]: {...obj}
         };
      }
      return {
        ...state,
        pagination: {...state.pagination, total: tc},
        list
      };
     },
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
    /* 如果传入force为true，则重置所有state
     * 如果传入keys, 则重置指定keys以及状态类(confirm,spinning等)state
     * 如果既未设置force，也未设置keys, 则根据localStorage中RESET_PART_STATE的值来决定部分重置还是全量重置
     */
    resetState(state, { payload = {} }) {
      let { force, keys } = payload;
      let nextState = { ...initialState };
      let resetAllState = localStorage.getItem(REMAIN_CORE_STATE) !== 'true';

      if (force) {
        resetAllState = true;
      } else if (keys) {
        resetAllState = false;
      }

      if (!resetAllState) {
        keys = keys || [];
        const resetKeys = keys.concat(AWLAYS_RESET_KEYS);
        const needResetState = pick(initialState, resetKeys);
        nextState = { ...state, ...needResetState };
      }

      localStorage.setItem(REMAIN_CORE_STATE, false);
      return nextState;
    },
    localizeState(state, { payload = {} }) {
      Object.keys((payload))
        .forEach((key) => {
          const value = payload[key];
          allNSLocalState[namespace][key] = value;
          storage.setItem(getNSLocalStateKey(key), value);
        });
      return state;
    },
    /**
     * 如果传入force为true，则重置与本model相关的所有持久化state
     * 如果传入keys, 则重置指定keys的持久化state
     */
    clearLocalState(state, { payload = {} }) {
      const { force, keys } = payload;
      // 当前ns下所有local state
      const localState = allNSLocalState[namespace];
      if (force) {
        allNSLocalState[namespace] = {};
        Object.keys(localState).forEach((key) => {
          localStorage.removeItem(getNSLocalStateKey(key));
        });
      } else if (keys) {
        if (!Type.isArray(keys)) {
          throw new Error('clearLocalState must have the payload parameter with an array typeof keys ');
        }
        keys.forEach((key) => {
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
    resetLocalState(state, { payload = {} }) {
      const { force, keys } = payload;
      if (force) {
        allNSLocalState[namespace] = initialLocalState;
        Object.keys(initialLocalState).forEach((key) => {
          const value = initialLocalState[key];
          storage.setItem(getNSLocalStateKey(key), value);
        });
      } else if (keys) {
        if (!Type.isArray(keys)) {
          throw new Error('resetLocalState must have the payload parameter with an array typeof keys ');
        }
        keys.forEach((key) => {
          const value = initialLocalState[key];
          allNSLocalState[namespace][key] = value;
          storage.setItem(getNSLocalStateKey(key), value);
        });
      }
      return state;
    },
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
export default (parent, properties) => {
  if (Type.isEmpty(properties)) {
    properties = parent;
    parent = null;
  }

  const model = createModal(parent);
  const { namespace, state: initialState, subscriptions, effects, reducers } = properties;

  allNSLocalState[namespace] = {};
  const initialLocalState = getInitialLocalState(namespace);
  Object.assign(initialState, initialLocalState);

  Object.assign(model, { namespace });
  Object.assign(model.state, initialState);
  Object.assign(model.reducers, enhanceReducers(reducers, { namespace, initialState: model.state, initialLocalState }));
  Object.assign(model.effects, enhanceEffects(effects, namespace));
  Object.assign(model.subscriptions, enhanceSubscriptions(subscriptions, namespace));

  return model;
};
