/* eslint-disable */

// import { Promise } from 'es6-promise';
import 'whatwg-fetch';
import BaseHttp from './base';
import middlewares from './middlewares';

// import { fetch } from 'whatwg-fetch';


const defaults = {
  middlewares: [
      middlewares.requestDomain(),
      middlewares.requestQuery(),
      middlewares.requestHeader(),
      middlewares.requestDataTransform(),
      middlewares.requestErrorHandler(),
      middlewares.responseStatus(),
      middlewares.responseJson(),
      middlewares.responseDataStatus(),
      middlewares.responseAuthorityValidator(),
      middlewares.responseErrorHandler(),
      //需要时打开
      middlewares.responseDataContent()
  ],
  config: {
      domain: '',
      servers: {},
      contentType: 'form'
  }
};


export default class Http extends BaseHttp{
  constructor(_config = {}, _middlewares = []) {
    super(_config, [...defaults.middlewares, ..._middlewares]); 
  }
  getRequestInit(args) {
    const requestInit = {};
    const requestInitKeys = ['method', 'headers', 'body', 'referrer', 'mode', 'credentials', 'cache', 'redirect'];
    Object.keys(args).forEach(key => {
      requestInitKeys.includes(key) && (requestInit[key] = args[key]);
    });
    return requestInit;
  }
  adapt(url, options){
    return fetch(url, options);
  }
}

function parseArgs(_config = {}, _middlewares = []) {
  if (_config instanceof Array) {
      _middlewares = _config;
      _config = {};
  } else if (typeof _config === 'string') {
      _config = {
          domain: _config
      };
  }

  return {
      _config,
      _middlewares
  };
}
Http.create = (...args)=>{

    let {
        _config,
        _middlewares
    } = parseArgs(...args);

    _config = {
        ...defaults.config,
        ..._config
    };
    // _middlewares = [..._middlewares];
    return new Http(_config, _middlewares);
} 