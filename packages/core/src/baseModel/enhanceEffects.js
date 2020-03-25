import { message as Message, Modal } from 'antd';
import Type  from '../utils/type';

const getNamespace = (type, namespace) => type.includes('/') ? type.split('/')[0] : namespace;

export default (effects = {}, { namespace, allNSLocalState }) => {
  function createPutEffect(sagaEffects) {
    const { put, take, select } = sagaEffects;
    function* putEffect(action) {
      yield put(action);
    }

    function* putSyncEffect(action) {
      const { type } = action;
      const tmpNamespace = getNamespace(type, namespace);

      yield put(action);
      yield take(`${type}/@@end`);
      return yield select(state => state[tmpNamespace]);
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
      const allState = yield select();

      if (typeof selector === 'string') {
        return allState[selector];
      }
      return selector(allState, allNSLocalState);
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

      if (!Type.isNill(key)) {
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
        if (!Type.isNill(key)) {
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
