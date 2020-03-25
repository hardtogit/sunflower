/*eslint-disable */
import  Http  from '../http/';
import  cookie  from 'js-cookie';
import  serverRoot from '@/config/server';
import { urlStrToObj, deepTrim, objToUrlStr } from './share';

const serverConfig = {
  servers: serverRoot[process.env.UMI_ENV],
  contentKey: 'content',
  // 使用mock代理类别：0 - 仅使用mock数据；1 - 部分使用mock数据；2 - 不使用mock数据
  useMockProxyType: 2,
  authorityFailureCodes: ['120001', '120002', '120003', '120010','10020002'],
  dataTransform(data, option) {
    // return { data, option };
    const { contentType } = option;
    let dt = data;
    if (contentType === 'form') {
      dt = objToUrlStr(deepTrim(urlStrToObj(data)));
    } else if (contentType === 'json') {
      dt = deepTrim(data);
    }
    return { data: dt, option };
  },
  header() {
    return { token: cookie.get('token') };
  }
};

export default Http.create(serverConfig);

export const apiHttp = Http.create({}).create();
