import Type  from '../utils/type';
import {pick} from '../utils/object';
import storage from './localStorage';

const REMAIN_CORE_STATE = '$$reset_part_state';
const LOCAL_STATE_SEP = '_';

function getLocalStateKey(namespace) {
  return stateKey => `$$${namespace}${LOCAL_STATE_SEP}state${LOCAL_STATE_SEP}${stateKey}`;
}

export default (reducers, { initialState, namespace, initialLocalState, allNSLocalState }) => {
  const AWLAYS_RESET_KEYS = ['visible', 'loading'];
  // initialState = { ...initialState };

  const getNSLocalStateKey = getLocalStateKey(namespace);

  const createLoadingReducer = originValue => (state, { payload = {} }) => {
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
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
    updateSearch(state, { payload }) {
      return {
        ...state,
        search: { ...state.search, ...payload }
      };
    },
    resetSearch(state) {
      return {
        ...state,
        search: { ...initialState.search }
      };
    },
    /* 如果传入force为true，则重置所有state
     * 如果传入keys, 则重置指定keys以及状态类(confirm,spinning等)state
     * 如果既未设置force，也未设置keys, 则根据localStorage中RESET_PART_STATE的值来决定部分重置还是全量重置
     */
    resetState(state, { payload = {} }) {
      const { force } = payload;
      let { keys } = payload;
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
    }
  });
};
