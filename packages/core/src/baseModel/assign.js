import { routerRedux } from 'dva/router';
import { _ } from 'lodash';
import extend from './extend';

const defaultSearch = { pn: 1, ps: 10 };
const defaultLoading = { list: false, confirm: false, submit: false, spin: false };

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
export default ({
  namespace,
  state,
  subscriptions,
  effects,
  reducers
}, parent) => {
  const initialSearch = { ...defaultSearch, ...state.search };

  const enhanceSubscriptions = (subscriptions = {}) => {
    function createWrappedSubscriber(subscriber) {
      return (props) => {
        const { dispatch } = props;

        const enhanceListener = (path, listener) => ({ query, params, ...reset }) => {
          // 从 query 中获取 search 需要的数据
          const searchKeys = Object.keys(initialSearch);
          const search = _.pick(query, searchKeys);

          // 获取 params 中数据
          const paramsObj = Object.keys(params).reduce((obj, key) => {
            if (!/\d+/.test(key)) {
              obj[key] = params[key];
            }
            return obj;
          }, {});

          dispatch({ type: 'resetState', payload: { force: true } });
          dispatch({ type: 'updateSearch', payload: search });
          dispatch({ type: 'updateState', payload: paramsObj });

          listener({ query, params: paramsObj, ...reset });
        };

        const listen = (...argv) => {
          let pathObj = argv[0];
          let force = argv[1];
          let listener = null;

          if (typeof force === 'object') {
            listener = () => dispatch(force);
            force = argv[2];
          }

          if (typeof force === 'function') {
            listener = force;
            force = argv[2];
          }

          if (typeof pathObj === 'string') {
            pathObj = { [pathObj]: listener };
          }

          if (force) {
            props.listen(...argv);
          } else {
            Object.keys(pathObj).forEach((path) => {
              const listener = pathObj[path];
              props.listen(path, enhanceListener(path, listener));
            });
          }
        };

        subscriber({ ...props, listen });
      };
    }

    return Object.keys(subscriptions).reduce((obj, key) => {
      obj[key] = createWrappedSubscriber(subscriptions[key]);
      return obj;
    }, {});
  };

  const defalutModel = {
    state: {
      tc: 0,
      datas: [],
      detail: {}
    },
    effects: {
      * goBack({ payload: path }, { put }) {
        if (path) {
          yield put(routerRedux.push(path));
        } else {
          yield put(routerRedux.goBack());
        }
      }
    },
    reducers: {
      updateSearch(state, { payload }) {
        return {
          ...state,
          search: { ...state.search, ...payload }
        };
      },
      resetSearch(state) {
        return {
          ...state,
          search: { ...state.search, ...initialSearch }
        };
      }
    }
  };

  const initialState = {
    ...defalutModel.state,
    ...state,
    search: initialSearch,
    loading: { ...defaultLoading, ...state.loading }
  };

  const model = {
    namespace,
    state: initialState,
    subscriptions: { ...enhanceSubscriptions(subscriptions) },
    effects: { ...defalutModel.effects, ...effects },
    reducers: { ...defalutModel.reducers, ...reducers }
  };

  return extend(model, parent);
};
