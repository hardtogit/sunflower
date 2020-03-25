import pathToRegexp from 'path-to-regexp';
import qs from 'qs';
import  Type  from '../utils/type';
import {pick} from '../utils/object';

const getQuery = search => qs.parse(search.slice(1));

const getParams = (match, key) => {
  const params = match.slice(1);
  const paramsObj = {};
  // 获取匹配的关键字
  const keys = key.match(pathToRegexp(key)).slice(1);
  // 将关键字作为params的属性并赋值
  keys.forEach((item, index) => {
    params[item.slice(1)] = params[index];
    paramsObj[item.slice(1)] = params[index];
  });

  return { params, paramsObj };
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
export default (subscriptions = {}, { initialState = {} }) => {
  function createWrappedSubscriber(subscriber) {
    return (props) => {
      const { dispatch, history } = props;
      const listen = (pathReg, handleEnter, handleLeave, enhance = true) => {
        let listeners = {};
        // 保存进入path的路由信息
        let enteredRoute = null;

        if (typeof handleLeave === 'boolean') {
          enhance = handleLeave; // eslint-disable-line
        }

        if (typeof pathReg === 'object') {
          listeners = pathReg;
        } else {
          listeners[pathReg] = [handleEnter, handleLeave];
        }

        // 进入listener之前执行的操作，如：重置状态，更新search，更新状态中的params值
        const beforeEnterListener = ({ query, paramsObj }) => {
          // 从 query 中获取 search 需要的数据
          const searchKeys = Object.keys(initialState.search);
          const search = pick(query, searchKeys);

          dispatch({ type: 'resetState', payload: { force: true } });
          dispatch({ type: 'updateSearch', payload: search });
          dispatch({ type: 'updateState', payload: paramsObj });
        };

        history.listen((location) => {
          const { pathname = '', search = '' } = location;

          Object.keys(listeners).forEach((key) => {
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
              // 获取 query
              const query = getQuery(search);

              /**
               * params 获取到的数据：[1, id: 1]
               * paramsObj 是一个普通对象，如：{ id: 1 }
               */
              const { params, paramsObj } = getParams(match, key);

              const route = { ...location, params, paramsObj, query };

              if (typeof enterAction === 'object') {
                const action = enterAction;
                enterAction = () => dispatch(action);
              }

              if (enhance) {
                beforeEnterListener(route);
              }
              enterAction(route);

              // 保存路由信息
              enteredRoute = route;
            } else if (enteredRoute && leaveAction) {
              // 1、没有匹配path，且enteredRoute不为null
              // 2、那就表示离开path，并触发onLeave
              if (typeof leaveAction === 'object') {
                dispatch(leaveAction);
              } else if (typeof leaveAction === 'function') {
                leaveAction(enteredRoute);
              }

              // 清除路由信息
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
