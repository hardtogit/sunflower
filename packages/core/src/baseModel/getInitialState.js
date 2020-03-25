const defaultSearch = { pn: 1, ps: 10 };
const defaultLoading = { list: false, confirm: false, submit: false, spin: false };

export default (configState = {}, state = {}, localState = {}) => {
  const search = {
    ...defaultSearch,
    ...(configState.search || {}),
    ...(state.search || {}),
    ...(localState.search || {})
  };

  const loading = {
    ...defaultLoading,
    ...(configState.loading || {}),
    ...(state.loading || {}),
    ...(localState.loading || {})
  };

  return {
    detail: {},
    datas: [],
    tc: 0,
    ...configState,
    ...state,
    ...localState,
    search,
    loading
  };
};
