import storage from './localStorage';
import getInitialState from './getInitialState';
import enhanceEffects from './enhanceEffects';
import enhanceReducers from './enhanceReducers';
import enhanceSubscriptions from './enhanceSubscriptions';
import extend from './extend';

export const REMAIN_CORE_STATE = '$$reset_part_state';

const LOCAL_STATE_SEP = '_';

// 获取初始localStorage值
const initialLocalStorage = Object.keys(storage).reduce((last, key) => ({ ...last, [key]: storage.getItem[key] }), {});

// 获取所有对应namespace下的local state
const allNSLocalState = {};

function getLocalStateKey(namespace) {
  // eslint-disable-next-line
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

class Model {
  constructor(config = {}) {
    this.config = config;
  }

  extend(userModel = {}) {
    const {
      namespace, state, subscriptions, effects, reducers
    } = userModel;

    const initialLocalState = getInitialLocalState(namespace) || {};
    const initialState = getInitialState(this.config.state, state, initialLocalState);

    return {
      namespace,
      state: initialState,
      subscriptions: enhanceSubscriptions(subscriptions, { initialState }),
      effects: enhanceEffects({ ...this.config.effects, ...effects }, { namespace, allNSLocalState }),
      reducers: enhanceReducers({ ...this.config.reducers, ...reducers }, {
        namespace, initialState, initialLocalState, allNSLocalState
      })
    };
  }
}

Model.extend = extend;

export default Model;

