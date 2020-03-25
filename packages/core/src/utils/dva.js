import Type from './type';

// 缓存dva app对象
export function store(dvaApp) {
  return (window.$$dvaApp = dvaApp);
}

// 获取对应的effect函数
export function getEffect(effectName, curNamespace) {
  const targetNamespace = effectName.includes('/') ? effectName.split('/')[0] : curNamespace;
  const targetEffectName = effectName.includes('/') ? effectName : `${curNamespace}/${effectName}`;
  const targetModel = window.$$dvaApp._models.find(({ namespace }) => namespace === targetNamespace);
  return targetModel.effects[targetEffectName];
}

// 附加loading信息, 需与call配置
export function withLoading(service, key, successMsg, errorMsg, withDone) {
  const config = Type.isString(key) ? { key } : { ...key };
  service.withExtra = {
    type: 'loading',
    successMsg,
    errorMsg,
    withDone,
    ...config
  };
  return service;
}

// 附加消息信息, 需与call配置
export function withMessage(service, successMsg, errorMsg) {
  service.withExtra = {
    type: 'message',
    successMsg,
    errorMsg
  };
  return service;
}

// 附加confirmLoading信息, 需与call配置
export function withConfirmLoading(service, successMsg, errorMsg, withDone) {
  return withLoading(service, { successMsg, errorMsg, withDone, key: 'confirm' });
}

// 附加spinning信息, 需与call配置
export function withSpinning(service, successMsg, errorMsg, withDone) {
  return withLoading(service, { successMsg, errorMsg, withDone, key: 'spinning' });
}
