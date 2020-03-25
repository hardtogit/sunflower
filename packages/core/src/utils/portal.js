/**
 * 传送门
 */

import { connect } from 'dva';
import * as routerRedux from 'react-router-redux';
import modelFactory from './model.factory';

function getEffectsAndReducers(model, dispatch) {
  const { effects, reducers } = model;
  let result = {};
  result = Object.keys(effects).reduce((prev, next) => {
    const key = next.split('/')[1];
    return {
      ...prev,
      [key]: param => dispatch({
        type: next,
        payload: param
      })
    };
  }, result);

  result = Object.keys(reducers).reduce((prev, next) => {
    const key = next.split('/')[1];
    return {
      ...prev,
      [key]: param => dispatch({
        type: next,
        payload: param
      })
    };
  }, result);
  result = { ...result,
    ...{ pop: () => dispatch(routerRedux.goBack()),
      replace: url => dispatch(routerRedux.replace(url)),
      push: (url) => dispatch(routerRedux.push(url))
    } };
  return result;
}

/**
 * model 注解
 * @param {*} keys model namespace名称
 */
export function model(...keys) {
  keys.unshift('layout');
  keys.unshift('commonModel');

  return function tar(target) {
    return connect(state => keys.reduce((prev, next) =>
      // prev =
      ({ ...prev, ...state[next] })
      , {}), (dispatch) => {
      let mergeDispatch = {};
      if (typeof keys[keys.length - 1] === 'function') {
        mergeDispatch = keys[keys.length - 1](dispatch);
      }

      const mapDispatch = keys.reduce((prev, next) => {
        const model = modelFactory.getModel(next);
        if (model) {
          const actions = getEffectsAndReducers(model, dispatch);
          return {
            ...prev,
            ...actions
          };
        }
        return { ...prev };
      }, {});
      mapDispatch.dispatch = dispatch;
      return { ...mapDispatch, ...mergeDispatch };
    })(target);
  };
}
